
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Todo = require('./models/Todo');
const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect('mongodb+srv://user:user@cluster0.rc7qyne.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('MongoDB Connected'))
.catch((err) => console.log(err))


app.get('/',(req,res)=>{
    res.send('Working..')
})




app.get('/todos', async (req, res) => {
    try {
        const todos = await Todo.find();
        res.json(todos);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.post('/todo/new', (req, res) => {
	try{
		const todo = new Todo({
			text: req.body.text
		})
		todo.save();
		res.json(todo);
	}
	catch (error) {
        console.error('Error saving todo:', error);
        res.status(500).json({ error: 'Error saving todo' });
    }
});

app.delete('/todo/delete/:id', async (req, res) => {
	try{
		const result = await Todo.findByIdAndDelete(req.params.id);

	res.json({result});
	}
	catch(err){
		console.log('Error saving todo:',error)
		res.status(500).json({error : 'Error deleting todo'})
	}

});

app.get('/todo/complete/:id', async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        if (!todo) {
            return res.status(404).json({ error: 'Todo not found' });
        }
        todo.complete = !todo.complete;
        await todo.save();
        res.json(todo);
    } catch (error) {
        console.error('Error completing todo:', error);
        res.status(500).json({ error: 'Error completing todo' });
    }
});


app.put('/todo/update/:id', async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);

        if (!todo) {
            return res.status(404).json({ error: 'Todo not found' });
        }

        todo.text = req.body.text;
        await todo.save();
        res.json(todo);
    } catch (error) {
        console.error('Error updating todo:', error);
        res.status(500).json({ error: 'Error updating todo' });
    }
});


app.listen(5000, () => console.log('Server started on port 5000'))
