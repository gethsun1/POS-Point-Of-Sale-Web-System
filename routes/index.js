var express = require('express');
var bcrypt = require('bcryptjs');
var passport = require('passport');
var router = express.Router();
var Product = require('../models/products.js')
var Cart = require('../models/cart.js');
var Sales = require('../models/sales.js');
var User = require('../models/user.js');
var Parent = require('../models/parent.js');
var Category = require('../models/category.js')
var config = require('../config/keys.js')
var mongojs = require('mongojs');
var db = mongojs(config.database, ['users'])
var auth = function (req, res, next) {
    if (!req.user) {
     
        res.redirect('/')
    } else {
        next()
    }
}
router.get('/',function(req,res){
    res.render('login.jade')
})
router.get('/signup',function(req,res){
    res.render('signup.jade')
})

router.get('/searchParent/:name',auth, function (req, res) {
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'KES',
        minimumFractionDigits: 2
    })
    

    Parent.find({},function(err,parents){
        Cart.find({userID:req.user.id},function(err,carts){
     Product.find({parent:req.params.name},function(err,products){
        let result = carts.map(({ price2 }) => price2)
        console.log(result)
        var total = 0;
                for (var i = 0; i < result.length; i++)
                {
                    total += result[i];
                }
            
          
    
        Category.find({}, function (err, categorys) {
            res.render('dashboard.jade',{
                categorys:categorys,
                parents:parents,
                carts:carts,
                total:formatter.format(total),
                user:req.user,
                products:products,
                amount:total
            })
        })

})
})   
})
    
   
})
router.get('/dashboard',auth, function (req, res) {
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'KES',
        minimumFractionDigits: 2
    })
    Parent.find({},function(err,parents){
        Cart.find({userID:req.user.id},function(err,carts){
     Product.find({},function(err,products){
        let result = carts.map(({ price2 }) => price2)
        console.log(result)
        var total = 0;
                for (var i = 0; i < result.length; i++)
                {
                    total += result[i];
                }
            
          
    
        Category.find({}, function (err, categorys) {
            res.render('dashboard.jade',{
                categorys:categorys,
                parents:parents,
                carts:carts,
                total:formatter.format(total),
                user:req.user,
                products:products,
                amount:total
            })
        })
   
    })
})   
})
    
   
})
router.post('/signup',function(req,res){
    
    if(req.body.password !== req.body.password2)
    {
        res.redirect('/')
    }
    else
    {
        var data = new User();
        data.username = req.body.username;
        data.firstname = req.body.firstname;
        data.lastname = req.body.lastname;
        data.role= 'Administrator';
        data.EmployeeNo = '....';
        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(req.body.password, salt, function (err, hash) {
                if (err) {
                    console.log(err);
                } else {
                    data.password = hash;
                    data.save(function (err) {
                        if (err) {
                            console.log(err)
                        } else {
    
                           
                            res.redirect('/')
    
    
                        }
                    })
                }
            })
        })
    }

})
router.post('/signup2',function(req,res){
    if(req.body.password !== req.body.password2)
    {
        res.redirect('/manage')
    }
    else
    {
        var data = new User();
        data.username = req.body.username;
        data.firstname = req.body.firstname;
        data.lastname = req.body.lastname;
        data.role= req.body.role;
        data.EmployeeNo = req.body.employee;
        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(req.body.password, salt, function (err, hash) {
                if (err) {
                    console.log(err);
                } else {
                    data.password = hash;
                    data.save(function (err) {
                        if (err) {
                            console.log(err)
                        } else {
    
                           
                            res.redirect('/manage')
    
    
                        }
                    })
                }
            })
        })
    }
    

})
router.get('/geth',function(req,res){
    res.render('misesi.jade')
})
router.get('/addproducts',auth,function (req, res) {
    Cart.find({userID:req.user.id}, function (err, carts) {
        res.render('addproducts.jade',{
            carts:carts
        })
    })
    
})
router.get('/viewproducts',auth, function (req, res) {
    Product.find({}, function (err, products) {
        res.render('viewproducts.jade', {
            products: products
        })

    })

})
router.get('/inventory',auth,function(req,res){
    Cart.find({userID:req.user.id}, function (err, carts) {
      Parent.find({},function(err,parents){
          Category.find({},function(err,categorys){
 
            Product.find({}, function (err, products) {
                res.render('inventory.jade', {
                    products: products,
                    categorys:categorys,
                    parents:parents,
                    carts:carts,
                    user:req.user
                })
        
            })
          })
      })
   
})
    
})
router.get('/deletecategory/:id',function(req,res){
    Category.findByIdAndRemove(req.params.id,function(err){
        res.redirect('/inventory')
    })
})
router.get('/sales',auth, function (req, res) {
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'KES',
        minimumFractionDigits: 2
    })
    Sales.find({},function(err,sales){
       
            Cart.find({userID:req.user.id}, function (err, carts) {
                let result = sales.map(({ price }) => price)
                console.log(result)
                var total = 0;
                        for (var i = 0; i < result.length; i++)
                        {
                            total += result[i];
                        }
                    
            res.render('sales.jade',
            {
                sales:sales,
                total:total,
                carts:carts,
                user:req.user,
                total:formatter.format(total)
            })
       
    })
    })
    
})
router.post('/parent',auth,function(req,res){
    Parent.findOne({name:req.body.parent},function(err,parent){
        if(parent)
        {
           
            res.redirect('/inventory')
        }
        else
        {  
            var data = new Parent();
            data.name= req.body.parent;
            data.count = 0
            data.save(function(err){
                res.redirect('/inventory')
            })
         
            
        }
    })

})
router.post('/category',auth,function(req,res){
    Category.findOne({name:req.body.name,parent:req.body.parent},function(err,category){
        if(category)
        {
          
            res.redirect('/inventory')
        }
        else
        {
            Parent.findOne({name:req.body.parent},function(err,parent){
                var query  = {
                    _id:parent.id
                }
                var count = parent.count + 1
                var data ={};
                data.count =count;
                Parent.update(query,data,function(err){
                    console.log('Updated')
                })
            })
        
            var data = new Category();
            data.parent= req.body.parent;
            data.name = req.body.name
            data.save(function(err){
                res.redirect('/inventory')
            })
         
        }
    })

})
router.get('/deleteparent/:id',auth,function(req,res){
    
    Parent.findById(req.params.id,function(err,parent){
        if(parent)
        {
            Category.remove({parent:parent.name},function(err){
                Parent.findByIdAndRemove(req.params.id,function(err){
                    res.redirect('/inventory')
                })
            })
        }
        else
        {
            res.redirect('/inventory')
        }
        
    })

})
router.get('/today',auth,function(req,res){
    var date = new Date();
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'KES',
        minimumFractionDigits: 2
    })
    
    var hour = ('0' + date.getHours()).slice(-2);
    var min = ('0' + date.getMinutes()).slice(-2);
    var sec = date.getSeconds();
    var year = date.getFullYear();
    var day = ('0' + date.getDate()).slice(-2);
    var month = ('0' + (date.getMonth() + 1)).slice(-2);
    //2019-11-14/04:56
    var timeHistory = year + "-" + month + "-" + day;
    Sales.find({date:timeHistory},function(err,sales){
        
         
        let result = sales.map(({ price }) => price)
               
        Cart.find({}, function (err, carts) {
            var total = 0;
            for (var i = 0; i < result.length; i++)
            {
                total += result[i];
            }
               
                res.render('sales.jade',
                {
                    sales:sales,
                    total:formatter.format(total),
                    carts:carts,
                    user:req.user
                })
            })
     
       
    })

})
router.get('/cart',auth, function (req, res) {

    Cart.find({userID:req.user.id}, function (err, carts) {
        Cart.find({userID:req.user.id}).distinct('price2', function (err, cartis) {
            var total = eval(cartis.join('+'))
            res.render('cart.jade', {
                carts: carts,
                total: total
            })
        })

    })
})

router.post('/search',auth, function (req, res) {
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'KES',
        minimumFractionDigits: 2
    })
   
    Product.find( { $text: { $search: req.body.search } },function(err,products){
        
        Parent.find({},function(err,parents){
            Cart.find({userID:req.user.id},function(err,carts){
         
            let result = carts.map(({ price2 }) => price2)
            console.log(result)
            var total = 0;
                    for (var i = 0; i < result.length; i++)
                    {
                        total += result[i];
                    }
                
              
        
            Category.find({}, function (err, categorys) {
                res.render('dashboard.jade',{
                    categorys:categorys,
                    parents:parents,
                    carts:carts,
                    total:formatter.format(total),
                    user:req.user,
                    products:products
                })
            })
       
        
    })   
        
    } )

})
})
router.get('/clearCart',auth, function (req, res) {

  Cart.remove({userID:req.user.id},function(err){
      res.redirect('/dashboard')
  })
})
router.get('/manage',auth,function(req,res){
User.find({},function(err,users){
    res.render('manage.jade',
    {
        users:users,
        user:req.user
    })
})
})
router.get('/deleteUser/:id',auth,function(req,res){
    User.findByIdAndRemove(req.params.id,function(err){
        res.redirect('/manage')
    })
})
router.post('/searchSales',auth,function(req,res){
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'KES',
        minimumFractionDigits: 2
    })
    var to = req.body.to;
    var from = req.body.from;
    Sales.find({created_on: {
        $gte: new Date(from),
        $lt: new Date(to)
    }},function(err,sales){
        
           
                let result = sales.map(({ price }) => price)
               
                Cart.find({}, function (err, carts) {
                    var total = 0;
                    for (var i = 0; i < result.length; i++)
                    {
                        total += result[i];
                    }
                
                res.render('sales.jade',
                {
                    sales:sales,
                    total:formatter.format(total),
                    carts:carts,
                    user:req.user
                })
            })
     
       
    })
})
router.get('/confirmCart',auth, function (req, res) {
    var date = new Date();

    
    var hour = ('0' + date.getHours()).slice(-2);
    var min = ('0' + date.getMinutes()).slice(-2);
    var sec = date.getSeconds();
    var year = date.getFullYear();
    var day = ('0' + date.getDate()).slice(-2);
    var month = ('0' + (date.getMonth() + 1)).slice(-2);
    //2019-11-14/04:56
    var timeHistory = year + "-" + month + "-" + day;
    var cartCursor = Cart.find({}).cursor();
    cartCursor.on('data', function (doc) {
        var data = new Sales();
        data.name = doc.name;
        data.quantity = doc.unit;
        data.price = doc.price2;
        data.created_on = new Date()
        data.date = timeHistory;
        data.save(function (err) {
            Product.findById(doc.productID,function(err,product){
                var query = {
                    _id: doc.productID
                }
                const quantity = product.quantityIssued + doc.unit;
                const data2 = {};
                data2.cart = false;
                data2.quantityIssued = parseFloat(quantity);
                data2.balance=product.quantityReceived-quantity;
                Product.update(query,data2,function(err){
                  Cart.findByIdAndRemove(doc.id,function(err){
                      console.log('Success')
                  })
                })
            })
          

           
        })

    })
    setTimeout(function(){
        res.redirect('/dashboard')
    },2000)
   
})
router.post('/addproducts',auth, function (req, res) {
    Category.findOne({name:req.body.category},function(err,category){
        var data = new Product();
        data.name = req.body.name;
        data.quantityReceived = req.body.quantity;
        data.quantityIssued = 0;
        data.balance =0;
        data.category=req.body.category;
        data.parent = category.parent;
        data.price = req.body.price;
        data.date = req.body.date;
        data.created_on = new Date();
        data.cart = false;
        data.save(function (err) {
            res.redirect('/inventory');
        });
    })
   
})
router.get("/addCart/:id",auth, function (req, res) {
    Product.findById(req.params.id, function (err, product) {
        var data = new Cart();
        data.name = product.name;
        data.category = product.category;
        data.parent = product.parent;
        data.quantity = product.quantityReceived;
        data.price = product.price;
        data.productID = req.params.id
        data.price2 = product.price;
        data.userID = req.user.id
        data.unit = 1;
        data.save(function (err) {
            var query = {
                _id: req.params.id
            }
            var data2 = {};
            data2.cart = true;
            Product.update(query, data2, function (err) {
                res.redirect('/dashboard')
            })

        })


    })
})
router.get('/removeCart/:id',auth, function (req, res) {
    Cart.findOneAndRemove(req.params.id, function (err) {
        var query = {
            _id: req.params.id
        }
        var data = {};
        data.cart = false;
        Product.update(query, data, function (err) {
            res.redirect('/dashboard')
        })
    })

});
router.post('/onChange/:id',auth, function (req, res) {
    Cart.findById(req.params.id, function (err, cart) {
        var query = {
            _id: req.params.id
        };
        var data = {};

        var price = cart.price * req.body.value;
        data.unit = parseFloat(req.body.value);
        data.price2 = parseFloat(price);
        Cart.update(query, data, function (err) {
            res.redirect('/dashboard')
        })





    })


})
router.get('/deleteItem/:id',auth, function (req, res) {

    Cart.findById(req.params.id, function (err, cart) {
        var query = {
            _id: cart.productID
        }
        var data = {};
        data.cart = false;
        Product.update(query, data, function (err) {
            Cart.findByIdAndRemove(req.params.id, function (err) {
                res.redirect('/cart')
            })

        })


    })
})
router.get('/deleteItem2/:id',auth,function(req,res){
    Product.findByIdAndRemove(req.params.id,function(err){
        res.redirect('/inventory')
    })
})
router.post('/admin-login',
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/',
        failureFlash: true,
        session: true

    })
);
router.get('/logout', function (req, res) {
    req.logout();
   
    res.redirect('/')
});
module.exports = router;