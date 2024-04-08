const { mkdirSync } = require("fs");
const createHttpError = require("http-errors");
const multer = require("multer");
const path = require("path");
const { badRequestMessage } = require("../command/messages/public.message");

// function setMulter(folderName) {
//     const storage = multer.diskStorage({
//         destination: (req, file, cb) => {
//             const desPath = path.join("public", "upload", folderName);
//             mkdirSync(desPath, { recursive: true })
//             cb(null, desPath);
//         },
//         filename: (req, file, cb) => {
//             const ext = path.extname(file.originalname);
//             const filename = `${new Date().getDate()}${ext}`;
//             cb(null, filename);
//         }
//     })
// }

const teamProfileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const desPath = path.join("public", "upload", "team-profile");
        mkdirSync(desPath, { recursive: true })
        cb(null, desPath);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const whiteListExt = [".jpg", ".png", ".jpeg"];
        if (!whiteListExt.includes(ext)) cb("bad ext", null);
        const filename = `${new Date().getTime()}${ext}`;
        cb(null, filename);
    }
});

// const fileFilterTeam = 

const uploadFileTeam = multer({ storage: teamProfileStorage, limits: { fileSize: 1204 * 1000 * 3 } });
module.exports = uploadFileTeam;