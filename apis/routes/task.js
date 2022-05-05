import express from "express";
import { isAuthenticated} from "../middleware/userAuth.js";
import { taskList,createTask,updateTask,deleteTask} from "./../controllers/taskController.js";
import multer from 'multer';

const storage = multer.diskStorage({

    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },

    filename: function (req, file, cb) {
        let file_type= {
          "image/png":"png",
          "image/jpeg":"jpeg",
          "image/jpg":"jpg"
        };
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, uniqueSuffix+'.'+file_type[file.mimetype])
    }
});

const fileFilter = (req,file,cb) => {
  let file_type= ["image/png", "image/jpeg", "image/jpg"];
  if(file_type.includes(file.mimetype)){ 
    cb(null, true);
  }else{
    req.file_upload_error = "file not allowed";
    return cb(null,false);
  }
}


const upload = multer({limits: { fileSize: 10000000}, storage: storage, fileFilter : fileFilter});

const router = express.Router();

router.get('/list-tasks', isAuthenticated, taskList);

router.post('/create-task',isAuthenticated, upload.single('uploaded_file'), createTask);

router.put('/:id/update-task',isAuthenticated, upload.single('uploaded_file'),updateTask);   

router.delete('/:id/delete-task',isAuthenticated, deleteTask);


export default router;

