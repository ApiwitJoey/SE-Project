const authController = require('../../controllers/auth');
const User = require('../../models/User');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

jest.mock('../../models/User');
jest.mock('nodemailer');

// mock for sendMail function
const sendMailMock = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  nodemailer.createTransport.mockReturnValue({
    sendMail: sendMailMock,
  });
});

describe('auth controller', () => {
  describe('forgotPassword', () => {
    it('should return 200 if email sent successfully', async () => {
      const req = { body: { email: 'test@example.com' }, protocol: 'http', get: jest.fn(() => 'localhost') };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const user = {
        email: 'test@example.com',
        getResetPasswordToken: jest.fn().mockReturnValue('resetToken'),
        save: jest.fn(),
      };

      User.findOne.mockResolvedValue(user);
      sendMailMock.mockResolvedValueOnce({});

      await authController.forgotPassword(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(user.getResetPasswordToken).toHaveBeenCalled();
      expect(user.save).toHaveBeenCalledWith({ validateBeforeSave: false });
      expect(sendMailMock).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ success: true, message: 'Email sent' });
    });

    it('should return 404 if user not found', async () => {
      const req = { body: { email: 'test@example.com' }, protocol: 'http', get: jest.fn(() => 'localhost') };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      User.findOne.mockResolvedValue(null);

      await authController.forgotPassword(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'There is no user with that email' });
    });
  });

});
