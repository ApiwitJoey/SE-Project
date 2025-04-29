const authController = require('../../controllers/auth');
const User = require('../../models/User');
const crypto = require('crypto');

jest.mock('../../models/User');

describe('Auth Controller', () => {

  let req, res, next;

  beforeEach(() => {
    req = {
      body: {},
      params: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('forgotPassword', () => {
    it('should return 404 if user not found', async () => {
      req.body.email = 'nonexistent@example.com';
      User.findOne.mockResolvedValue(null);

      await authController.forgotPassword(req, res, next);

      expect(User.findOne).toHaveBeenCalledWith({ email: 'nonexistent@example.com' });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'There is no user with that email' });
    });

    it('should send an email if user found', async () => {
      const fakeUser = {
        email: 'test@example.com',
        firstname: 'Test',
        lastname: 'User',
        getResetPasswordToken: jest.fn().mockReturnValue('123456'),
        save: jest.fn()
      };
      req.body.email = 'test@example.com';
      User.findOne.mockResolvedValue(fakeUser);

      await authController.forgotPassword(req, res, next);

      expect(fakeUser.getResetPasswordToken).toHaveBeenCalled();
      expect(fakeUser.save).toHaveBeenCalledWith({ validateBeforeSave: false });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ success: true, message: 'Email sent' });
    });

  });

  describe('resetPassword', () => {
    it('should return 400 if token is invalid or expired', async () => {
      req.params.otp = 'invalidotp';
      User.findOne.mockResolvedValue(null);

      await authController.resetPassword(req, res, next);

      expect(User.findOne).toHaveBeenCalledWith(expect.objectContaining({
        resetPasswordToken: expect.any(String),
        resetPasswordExpire: { $gt: expect.any(Number) }
      }));
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Invalid or expired OTP' });
    });

    it('should reset password if token is valid', async () => {
      const fakeUser = {
        password: '',
        resetPasswordToken: 'some-token',
        resetPasswordExpire: Date.now() + 10000,
        save: jest.fn()
      };
      req.params.otp = 'validotp';
      req.body.password = 'newpassword123';
      User.findOne.mockResolvedValue(fakeUser);

      jest.spyOn(authController, 'sendTokenResponse').mockImplementation(() => {});  // mock sendTokenResponse

      await authController.resetPassword(req, res, next);

      expect(fakeUser.password).toBe('newpassword123');
      expect(fakeUser.resetPasswordToken).toBeUndefined();
      expect(fakeUser.resetPasswordExpire).toBeUndefined();
      expect(fakeUser.save).toHaveBeenCalled();
      expect(authController.sendTokenResponse).toHaveBeenCalledWith(fakeUser, 200, res);
    });
  });

});