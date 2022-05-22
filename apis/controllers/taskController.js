import Task from "../models/Task.js";

export const taskList = async (req, res) => {
    try {
        let query = {owner:req.user._id}; 
        if(req.query?.category) query.category = req.query.category;
        
        const tasks = await Task.find(query,null,{sort: {createdAt:-1}});

        tasks.map(task=> {
            if(task && task.image) task.image= `${req.protocol}://${req.get('host')}/${task.image}`
            return task
        })
        res.status(200).send({
            message: "Task list",
            tasks: tasks
        });
    } catch (err) {
        res.status(500).send({
            message: "Error",
            error: err
        });
    }
}

export const createTask = async (req, res) => {
    
    if(req.file_upload_error) return res.status(500).send({ message: 'Only image are allowed' });

    const task = new Task({...req.body,owner:req.user._id});

    if(req.file && req.file.fieldname ){
        task.image = req.file.filename;
    }

    try {
        const newTask = await task.save();
        if(newTask.image ){
            newTask.image = `${req.protocol}://${req.get('host')}/${newTask.image}`;
        }
        res.status(201).send({
            message: "Task created",
            task: newTask
        });

    } catch (err) {
        res.status(500).send({
            message: "Error",
            error: err
        });
    }
}

export const updateTask = (req, res) => {

    if(req.file_upload_error) return res.status(500).send({ message: 'Only image are allowed' });

    const task = {...req.body,owner:req.user._id};
    if(req.file && req.file.filename){
        task.image=req.file.filename
    }

    Task.findOneAndUpdate({ _id: req.params.id}, task, { new: true }, (err, task) => { 
        if (err) {
            res.status(500).send({
                message: "Error",
                error: err
            });
        } else {
            if(task.image ){
                task.image = `${req.protocol}://${req.get('host')}/${task.image}`;
            }
            res.status(200).send({
                message: "Task updated",
                task: task
            });
        }
    })
}

export const deleteTask = (req, res) => {
    Task.findOneAndDelete({ _id: req.params.id }, (err, task) => {
        if (err) {
            res.status(500).send({
                message: "Error",
                error: err
            });
        } else {
            res.status(200).send({
                message: "Task deleted",
                task: task
            });
        }
    })
}
