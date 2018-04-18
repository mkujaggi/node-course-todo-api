const expect=require('expect');
const request=require('supertest');
const {ObjectID}=require('mongodb');

const {app}=require('./../server');
const {Todo}=require('./../models/todo');

const todos=[{
    _id:new ObjectID(),
    text:'Fist text todo'
},{
    _id:new ObjectID(),
    text:'Second test todo',
    completed:true,
    completedAt:333
}];

beforeEach((done)=>{
    Todo.remove({}).then(()=>{
        Todo.insertMany(todos);
    }).then(()=>done());
});

describe('POST/todos',()=>{
    it('should create a new todo',(done)=>{
        var text= 'test todo text';

        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((res)=>{
                expect(res.body.text).toBe(text);
            })
            .end((err,res)=>{
            if(err){
                return done(err);
            } 
            Todo.find({text}).then((todos)=>{
                expect(todos.length).toBe(1);
                expect(todos[0].text).toBe(text);
                done();
            }).catch((e)=>{
                done(e);
            });
        });
    });

    it('should not create todo with invalid body data',(done)=>{
        request(app)
        .post('/todos')
        .send()
        .expect(400)
        .end((err,res)=>{
            if(err){
                return done(err);
            }
            Todo.find().then((todos)=>{
                expect(todos.length).toBe(2);
                done();
            }).catch((e)=>{
                done(e);
            });
        });
    });
});

describe('GET /todo route',()=>{
    it('should get all todos',(done)=>{
        request(app)
        .get('/todos')
        .expect(200)
        .expect((res)=>{
            expect(res.body.todos.length).toBe(2);
        })
        .end(done);
        
    });
});

describe('GET /todo/:id',()=>{
    it('Should return todo.',(done)=>{
        request(app)
        .get(`/todos/${todos[0]._id.toHexString()}`)
        .expect(200)
        .expect((res)=>{
            expect(res.body.todo.text).toBe(todos[0].text);
        })
        .end(done);
    });

    it('Should return 404 if todo not found',(done)=>{
        var objId=new ObjectID().toHexString();
        // console.log(`todos/${objId}`);
        request(app)
        .get(`/todos/${objId}`)
        .expect(404)
        .end(done);
    });

    it('Should return 404 for non-object ids.',(done)=>{
        request(app)
        .get(`/todos/123`)
        .expect(404)
        .end(done);
    });
});

describe('DELETE /todos/:id',()=>{
    it('should remove todo',(done)=>{
        var hexId=todos[0]._id.toHexString();
        request(app)
        .delete(`/todos/${hexId}`)
        .expect(200)
        .expect((res)=>{
            expect(res.body.todo._id).toBe(hexId);
        })
        .end((err,res)=>{
            if(err){
                return done(err);
            }
            Todo.findById(hexId).then((todo)=>{
                expect(todo).toBeFalsy();
                done();

            }).catch((e)=>done(e));
        });
    });

    it('should return 404 if todo not found',(done)=>{
        var objId=new ObjectID().toHexString();
        
        request(app)
        .delete(`/todos/${objId}`)
        .expect(404)
        .end(done);
    });
    it('should return 404 if object id is invalid.',(done)=>{
        request(app)
        .delete(`/todos/123`)
        .expect(404)
        .end(done);
    });
});
describe('PATCH /todos/:id',()=>{
    it('should update the todo.',(done)=>{
        var hexId=todos[0]._id.toHexString();
        var text='this is the updated text from  testing.'
        request(app)
        .patch(`/todos/${hexId}`)
        .send({
            completed:true,
            text
        })
        .expect(200)
        .expect((res)=>{
            expect(res.body.todo.text).toBe(text);
            expect(res.body.todo.completed).toBe(true);
            expect(typeof res.body.todo.completedAt).toBe('number');
        })
        .end(done);
    });

    it('should clear completed at when todo is not completed.',(done)=>{
        var hexId=todos[1]._id.toHexString();
        var text='updated text from test 2';
        request(app)
        .patch(`/todos/${hexId}`)
        .send({
            completed:false,
            text
        })
        .expect(200)
        .expect((res)=>{
            expect(res.body.todo.text).toBe(text);
            expect(res.body.todo.completed).toBe(false);
            expect(res.body.todo.completedAt).toBeFalsy();
        }).end(done);

    });
})