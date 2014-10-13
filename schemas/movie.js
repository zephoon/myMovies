/**
 * Created by yuzefeng on 14-10-8.
 */
var mongoose = require('mongoose');
var MovieSchema = new mongoose.Schema({
    doctor:String,
    title:String,
    language:String,
    country:String,
    summary:String,
    flash:String,
    poster:String,
    year:Number,
    meta:{
        createAt:{
            type:Date,
            dafault:Date.now()
        },
        updateAt:{
            type:Date,
            dafault:Date.now()
        }
    }

});
MovieSchema.pre('save', function (next) {
    if(this.isNew){
        this.meta.createAt = this.meta.updateAt = Date.now();
    }else{
        this.meta.updateAt = Date.now();
    }
    next();
});

MovieSchema.statics = {
    fetch: function (cb) {
        return this.find({}).sort('meta.updateAt').exec(cb);
    },
    findById: function (id,cb) {
        return this.findOne({_id:id}).exec(cb);
    },
    removeById: function (id,cb) {
        return this.remove({_id:id}).exec(cb);
    }
}
module.exports = MovieSchema;