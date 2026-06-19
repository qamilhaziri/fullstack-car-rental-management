import multer from "multer"
import path from "path"
import { randomUUID } from "crypto";
const storage = multer.diskStorage({

    destination : (req,file,cb) => {
        cb(null,"public/uploads");
    },
    filename : (req,res,cb) => {
        const fileName = randomUUID() + path.extname(file.originalname);

        cb(null,fileName);
    }
})

const upload = multer({storage : storage});

export default upload