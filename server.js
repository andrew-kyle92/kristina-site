//Middleware
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const { on } = require('nodemon');

// Date Function
function getDate(){
    const today = new Date;
    const options = {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    }

    return today.toLocaleDateString("en-US", options);
}

// Setting static and other middleware configs
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

// Mongoose DB Parameters
mongoose.connect('mongodb+srv://admin-andrew:Maci&Drew07@cluster0.60mfv.mongodb.net/orderRequestsDB', {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});

const shirtsSchema = mongoose.Schema({size: String, color: String, complete: Boolean});

const schema = new mongoose.Schema({
    date: {
        date: String,
        month: String,
        year: String
    },
    fname: String,
    lname: String,
    qty: Number,
    shirts: [shirtsSchema],
    notes: String,
    price: String,
    paid: Boolean,
    complete: Boolean,
});

const Order = mongoose.model('Order', schema);

// Home Page
app.get('/', function(req,res){
    const script = '';
    const title = "Home | Orders"

    res.render('home', {title: title, script: script});
});

// Orders Page
app.get('/orders', function(req,res){
    const script = '/scripts/collapse.js';
    const title = "Orders"
    Order.find({}, function(err, foundOrders){
        if(err){
            console.log(err);
        }
        else{
            res.render('orders', {title: title, orders: foundOrders, script: script})
        }
    });
});

// Order Page
app.get('/order/:orderID', function(req, res){
    const script = '/scripts/order.js';
    orderId = req.params.orderID;

    Order.findById({_id: orderId}, function(err, foundOrder){
        if(err){
            console.log(err);
        }
        else{
            let title = "Order: " + foundOrder.fname + " " + foundOrder.lname;
            res.render('order', {title: title, content: foundOrder, script: script});
        }
    });
});

// Order page complete
app.post('/complete', function(req,res){
    const orderId = req.body.id;
    const shirtId = req.body.shirtId;
    var checkbox = req.body.checkbox;

    Order.findById({_id: orderId}, function(err, foundOrder){
        if(err){
            console.log(err)
        }
        else{
            for(var i = 0; i < foundOrder.shirts.length; i++){
                if(checkbox == 'on'){
                    if(String(foundOrder.shirts[i]._id) == shirtId){
                        foundOrder.shirts[i].complete = true;
                    }
                    else{
                        continue;
                    }
                }
                else{
                    if(String(foundOrder.shirts[i]._id) == shirtId){
                        foundOrder.shirts[i].complete = false;
                    }
                    else{
                        continue;
                    }
                }
            }

            foundOrder.save();
        }
    });



    res.redirect(`/order/${orderId}`);
});

// POst route for payment Checkbox
app.post('/paid', function(req, res){
    const id = req.body.id;
    const paid = req.body.paid;

    Order.findById({_id: id}, function(err, foundOrder){
        if(err){
            console.log(err);
        }
        else{
            if(paid == 'on'){              
                if(foundOrder.paid == false){
                    foundOrder.paid = true;
                }
            }
            else{
                if(foundOrder.paid == true){
                    foundOrder.paid = false;
                }
            }
        }
        foundOrder.save();
    });

    res.redirect(`/order/${id}`);
});

// New Order
var script = '/scripts/qtyCounter.js';
app.get('/new-order', function(req, res){
    title = "New Order"
    res.render('new-order', {title: title, date: getDate(), script: script});
});

// New Order Post
app.post('/new-order', function(req, res){
    const date = req.body.date;
    const month = date.slice(0, 3);
    const year = date.slice(-4);
    const size = req.body.size;
    const color = req.body.color;
    const content = {
        fname: req.body.fname,
        lname: req.body.lname,
        qty: req.body.qty,
        shirts: [],
        notes: req.body.notes,
        price: req.body.price
    }
    for(var i = 0 ; i < size.length; i++){
        if(typeof(size) === 'string')
            content.shirts.push({size: size, color: color, complete: false});
        else{
            content.shirts.push({size: size[i], color: color[i], complete: false});
        }
    }


    const order = new Order({
        date: {
            date: date,
            month: month,
            year: year
        },
        fname: content.fname,
        lname: content.lname,
        shirts: content.shirts,
        qty: content.qty,
        notes: content.notes,
        price: content.price,
        paid: false,
        complete: false
    });

    order.save(function(err){
        if(err){
            console.log(err);
        }
        else{
            console.log("Order submitted successfully.")
        }
    });

    res.redirect('/');
});

app.get('/order/:orderId/order-edit', function(req, res){
    const script = "/scripts/edit.js";
    const orderId = req.params.orderId
    Order.findById({_id: orderId}, function(err, foundOrder){
        if(err){
            console.log(err);
        }
        else{
            let title = "Edit Order: " + foundOrder.fname + " " + foundOrder.lname;
            res.render('order-edit', {title: title, content: foundOrder, script: script});
        }
    });
});

app.post('/order/:orderId/order-edit', function(req, res){
    const itemToDelete = req.body.delete; // Array if multiple items were checked
    const itemsToDelete = [];
    const orderId = req.body.id;
    const size = req.body.size;
    const color = req.body.color;
    let newSize = req.body.newSize;
    const newColor = req.body.newColor;
    const content = {
        fname: req.body.fname,
        lname: req.body.lname,
        qty: req.body.qty,
        shirts: [],
        newShirts: [],
        notes: req.body.notes,
        price: req.body.price
    }

    if(itemToDelete === undefined){
        console.log('No items to delete')
    }
    else if(typeof(itemToDelete) === 'string'){
        itemsToDelete.push(itemToDelete);
    }
    else{
        for(var i = 0; i < itemToDelete.length; i++){
            itemsToDelete.push(itemToDelete[i]);
        }   
    }

    for(var i = 0 ; i < size.length; i++){
        if(typeof(size) === 'string')
            content.shirts.push({size: size, color: color});
        else{
            content.shirts.push({size: size[i], color: color[i]});
        }
    }
    if(newSize == undefined){
        newSize = [];
    }
    else{
        if(typeof(newSize) === 'string'){
            for(var i = 0 ; i < newSize.length; i++){
                content.newShirts.push({size: newSize, color: newColor, complete: false});
            }
        }
        else{
            content.newShirts.push({size: newSize[i], color: newColor[i], complete: false});
        }
    }

    Order.findById({_id: orderId}, function(err, foundOrder){
        if(err){
            console.log(err);
        }
        else{
            for(var item in content ){
                if(item === 'shirts'){
                    continue;
                }
                else{
                    switch(item){
                        case 'fname':
                            if(content[item] === foundOrder.fname){
                                continue;
                            }
                            else{
                                Order.findByIdAndUpdate(orderId, {fname: content[item]}, function(err){
                                    if(err){
                                        console.log(err);
                                    }
                                    else{
                                        console.log('fname was updated');
                                    }
                                });
                            }
                            break;
                        case 'lname':
                            if(content[item] === foundOrder.lname){
                                continue;
                            }
                            else{
                                Order.findByIdAndUpdate(orderId, {lname: content[item]}, function(err){
                                    if(err){
                                        console.log(err);
                                    }
                                    else{
                                        console.log('lname was updated');
                                    }
                                });
                            }
                            break;
                        case 'qty':
                            if(parseInt(content[item]) === foundOrder.qty){
                                continue;
                            }
                            else{
                                Order.findByIdAndUpdate(orderId, {qty: content[item]}, function(err){
                                    if(err){
                                        console.log(err);
                                    }
                                    else{
                                        console.log('qty was updated');
                                    }
                                });
                            }
                            break;
                        case 'notes':
                            if(content[item] === foundOrder.notes){
                                continue;
                            }
                            else{
                                Order.findByIdAndUpdate(orderId, {notes: content[item]}, function(err){
                                    if(err){
                                        console.log(err);
                                    }
                                    else{
                                        console.log('notes was updated');
                                    }
                                });
                            }
                            break;
                        case 'price':
                            if(content[item] === foundOrder.price){
                                continue;
                            }
                            else{
                                Order.findByIdAndUpdate(orderId, {price: content[item]}, function(err){
                                    if(err){
                                        console.log(err);
                                    }
                                    else{
                                        console.log('Price was updated');
                                    }
                                });
                            }
                        default:
                    }
                }
            }
        }
    });

    Order.findById({_id: orderId}, function(err, foundOrder){
        if(err){
            console.log(err);
        }
        else{
            let shirtsLen = foundOrder.shirts.length;
            for(let i = 0; i < shirtsLen; i++){
                if(content.shirts[i].size === foundOrder.shirts[i].size && content.shirts[i].color === foundOrder.shirts[i].color){
                    continue;
                }
                else{
                    foundOrder.shirts[i].size = content.shirts[i].size;
                    foundOrder.shirts[i].color = content.shirts[i].color;
                    console.log(`${foundOrder.shirts[i]._id} was updated`);
                }
            }
            let newShirtsLen = content.newShirts.length;
            for(let i = 0; i < newShirtsLen; i++){
                let shirtUpdate = content.newShirts[i];
                let shirtIndex = content.newShirts.indexOf(shirtUpdate);
                console.log(`Index(${shirtIndex}): ${shirtUpdate}`)
                foundOrder.shirts.push(shirtUpdate);
            }
            for(let i = 0; i < itemsToDelete.length; i++){
                foundOrder.shirts.pull(itemsToDelete[i])
                console.log(`${itemsToDelete[i]} was deleted`);
                foundOrder.qty -= itemsToDelete.length;
            }
            foundOrder.qty = foundOrder.shirts.length;
            foundOrder.save();
            res.redirect(`/order/${foundOrder._id}`);
        }
    });
});


app.listen(3000, function(){
    console.log('Server started on port 3000');
});