//***************************************************************************************************
//Modulos
//***************************************************************************************************

const { Console } = require('console')
const express = require('express')
const Router = express.Router()
const mongoose = require('mongoose')


//***************************************************************************************************
//Models
//***************************************************************************************************
    require('../models/Categoria')
    require('../models/postagens')
    //Config Model
        const Categoria = mongoose.model('categorias')
        const post = mongoose.model("Postagens")


//***************************************************************************************************
//Rotas
// **************************************************************************************************
    //Get
    //************************************************************************************************* */
        Router.get('/', (req, res)=>{
            res.render('admin/index')
        })
        Router.get('/categorias/add', (req, res)=>{
            res.render('admin/addCategorias')
        })
        Router.get('/categorias', (req, res)=>{
            Categoria.find().then(category =>{
                res.render('admin/categorias', {categorias: category})
            }).catch(err=>{
                req.flash('error_msg', "Houve um erro ao listar as categorias")
                res.redirect('/admin')
            })            
        })        
        Router.get('/categorias/edit/:id', (req,res)=>{            
            Categoria.findOne({_id: req.params.id}).then(Category=>{
                res.render('admin/editCategorias', {categoria: Category})
            }).catch(err=>{
                res.redirect('/admin/categorias')
                req.flash('error_msg', 'Houve um erro ao encontrar o id')
                
                console.log(err)
            })           
        })
        Router.get("/postagens", (req, res)=>{ 
            post.find().populate("category").sort({data: "desc"}).then(posts => {
                res.render("admin/postagens", {postagens: posts})
            }).catch(err=>{
                req.flash("error_msg", "Houve um erro ao procurar por postagens")
                res.redirect("/admin")
            })
        })
        Router.get('/postagens/add', (req, res)=>{
            Categoria.find().then(category=>{
                res.render('admin/addPostagem', {categorias: category})
            }).catch(err=>{
                req.flash('error_msg', "Houve um erro ao carregar as categorias")
            })
        })
    //*********************************************************************************************** */    
    //Post 
    //*********************************************************************************************** */    
   
        Router.post('/categorias/nova', (req, res)=>{
            var errors = []
            if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
                errors.push({
                    text: "Nome invalido!"
                })
            }
            if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
                errors.push({
                    text: "Slug invalido"
                })
            }
            if(errors.length > 0){
                res.render('admin/addCategorias', {erros: errors})
            }else{
                const novaCategoria = {
                    nome: req.body.nome,
                    slug: req.body.slug
                }
            
                new Categoria(novaCategoria).save().then(()=>{
                    req.flash('success_msg', "Categoria criada com sucesso")
                    res.redirect('/admin/categorias')
                }).catch((err)=>{
                    req.flash("error_msg", "Houve um erro ao salvar a categoria")
                    console.log("ERRO" + err)
                })
            }
        
        
        
            
        })
        
        Router.post('/categorias/edit', (req, res)=>{
                
            Categoria.findOne({_id: req.body._id}).then(doc=>{
                let errors = []
                if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
                    errors.push({
                        text: "Nome invalido!"
                    })
                }
                if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
                    errors.push({
                        text: "Slug invalido"
                    })
                }
                if(errors.length > 0){
                    req.flash("error_msg", "Nome ou Slug incorreto!")
                    res.render('admin/editCategorias', {erros: errors, categoria: doc})
                    
                } else{
                    doc.nome = req.body.nome;
                    doc.slug = req.body.slug;
                    doc.save().then(()=>{
                        req.flash('success_msg', "Categoria editada com sucesso")
                        res.redirect("/admin/categorias/")
                    }).catch(err=>{
                        req.flash("error_msg", "Houve um erro interno ao tentar editar a categoria")
                        console.log(err)
                    })
                }   
                
            })
            
            
        })
        
        Router.post("/categorias/delete", (req, res)=>{
            
            Categoria.findByIdAndRemove(req.body._id).then(()=>{
                
                req.flash("success_msg", "Categoria deletada com sucesso!")
                res.redirect('/admin/categorias')
            }).catch(err=>{
                console.log(err)
            })
        })
        Router.post("/postagens/nova", (req, res)=>{
            console.log(req.body.category)
            if(req.body.category == 0){
                req.flash("error_msg", "Categoria Invalida!")
                res.redirect("/admin/postagens/add")
            }else{
                new post({
                    titulo: req.body.titulo,
                    slug: req.body.slug,
                    desc: req.body.desc,
                    category: req.body.category,
                    content: req.body.content
                }).save().then(()=>{
                    req.flash("success_msg","Postagem criada com sucesso")
                    res.redirect("/admin/postagens")
                }).catch(err=>{
                    console.log(err)
                    req.flash("error_msg", "Erro interno ao criar postagem")                    
                    res.redirect("/admin/postagens")
                }) 
            }
        })


//Export        
module.exports = Router



