const Shop = require("../models/Shop");
const Service = require("../models/Service");

// @desc Get one Service
// @route GET /api/v1/services/:id
// @access Private
// explaination : this will get service (doesn't have anything to do with shop btw)
// I added this in case anyone want to test anything wiht service
exports.getService = async (req, res, next) => {
    try {
        const service = await Service.findById(req.params.id).populate({
            path: "shop",
            select: "-_id",
        });
        if (!service) {
            return res.status(404).json({
                success: false,
                message: `No service with the id of ${req.params.id}`,
            });
        }
        // anyone can get a service so no authorize check
        res.status(200).json({ success: true, data: service });
    } catch (err) {
        console.log(err.stack);
        res.status(500).json({ success: false, msg: "Cannot get service" });
    }
};

// @desc Get all services
// @route GET /api/v1/services/
// @access Private
exports.getServices = async (req, res, next) => {
    let query;
    if (req.params.shopId) {
        // if this get called in context of a shop
        query = Service.find({
            shop: req.params.shopId,
        }).populate({
            path: "shop",
            select: "name",
        });
    } else {
        // if this doesn't have anything to do with a shop (just get all services possible)
        query = Service.find().populate({
            path: "shop",
            select: "name",
        });
    }

    try {
        const service = await query;
        res.status(200).json({
            success: true,
            count: service.length,
            data: service,
        });
    } catch (err) {
        console.log(err.stack);
        return res
            .status(500)
            .json({ success: false, message: "Cannot find Service" });
    }
};
// @desc Create service
// @route POST /api/v1/services/
// @access Private
// note : this always get call in context of a shop
exports.createService = async (req, res, next) => {
    try {
        req.body.shop = req.params.shopId;
        const shop = await Shop.findById(req.params.shopId);
        if (!shop) {
            return res.status(404).json({
                success: false,
                message: `No shop with the id of${req.params.shopId}`,
            });
        }
        // if shop exist
        if (req.user.role !== 'admin') {
            return res.status(400).json({
                success: false,
                message: `Only admin can create more service`,
            })
        }
        const service = await Service.create(req.body);
        const populatedService = await service.populate('shop');
        res.status(201).json({ success: true, data: populatedService });
    } catch (err) {
        console.log(err.stack);
        return res
            .status(500)
            .json({ success: false, message: "Cannot create Service" });
    }
};

// @desc Update service
// @route PUT /api/v1/services/:id
// @access Private
exports.updateService = async (req, res, next) => {
    try {
        let service = await Service.findById(req.params.id);
        if (!service) {
            return res.status(404).json({
                success: false,
                message: `No service with the id of ${req.params.id}`,
            });
        }
        if (req.user.role !== "admin") {
            return res.status(401).json({
                success: false,
                message: `Only admin can manipulate service`,
            });
        }
        service = await Service.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        res.status(200).json({
            success: true,
            data: service,
        })
    } catch (err) {
        console.log(err.stack);
        res.status(500).json({ success: false, message: 'Cannot update service' });
    }
};

// @desc Delete service
// @route DELETE /api/v1/services/:id
// @access Private
exports.deleteService = async (req, res, next) => {
    try {
        const service = await Service.findById(req.params.id);
        if(!service) {
            return res.status(404).json({
                success: false,
                message: `No service with the id of ${req.params.id}`,
            });
        }
        if(req.user.role !== 'admin') {
            return res.status(401).json({
                success:false,
                message: 'Only admin can delete service'
            })
        }
        await service.deleteOne();
        res.status(200).json({
            success: true, data: {},
        })
    } catch(err) {
        res.status(500).json({success: false , message: 'Cannot delete Service'});
    }
};