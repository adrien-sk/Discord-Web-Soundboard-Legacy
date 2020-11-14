const express = require('express');

const router = express.Router();

const dbRequests = require ('../database/db.requests');

const spawn = require('child_process').spawn;
const cmd = require('ffmpeg-static');
const formidable = require('formidable');
const fs = require('fs');


router.get('/', (req, res) => {
	res.json({
		message: 'Soundboard API'
	});
});

router.get('/getusercategories', async (req, res) => {
	const dbResults = await dbRequests.getUserCategories(req.user.id);
	res.json(dbResults);
});

router.get('/getusersoundsobject', async (req, res) => {
	const dbResults = await dbRequests.getUserSoundsObject(req.user.id);
	res.json(dbResults);
});

router.put('/updateusersound', async (req, res) => {
	const dbResults = await dbRequests.updateUserSound(req.body.userSoundId, req.body.newCategory);
	res.json(dbResults);
});

// TODO : Into post
router.put('/addusersound', async (req, res) => {
	const dbResults = await dbRequests.addUserSound(req.user.id, req.body.userSoundId, req.body.newCategory);
	res.json(dbResults);
});

router.delete('/deleteusersound', async (req, res) => {
	const dbResults = await dbRequests.deleteUserSound(req.body.userSoundId);
	res.json(dbResults);
});

router.post('/addusercategory', async (req, res) => {
	const dbResults = await dbRequests.addUserCategory(req.user.id);
	res.json(dbResults);
});

router.put('/updatecategoryname', async (req, res) => {
	const dbResults = await dbRequests.updateCategoryName(req.body.categoryId, req.body.newCategoryName);
	res.json(dbResults);
});

router.delete('/deleteusercategory', async (req, res) => {
	const dbResults = await dbRequests.deleteUserCategory(req.body.categoryId);
	res.json(dbResults);
});

router.post('/upload', async (req, res) => {
	const form = formidable();
	
	// ./sounds/test
	form.uploadDir = process.env.TEMP_FOLDER;

	// 50 mo
	form.maxFileSize = 50 * 1024 * 1024;
	form.multiples = true;

	form.parse(req, async (err, fields, files) => {
		if (err) {
			console.log(err);
			next(err);
			return;
		}

		//Transform to ogg
		//let oldFileName = files.sounds[0].name; // = "machin.mp3"
		let tempFileName = files.sounds.path; // = "sounds/test/upload_fdgksdjfglkdjsfhglsdfg"
		let newFileName = slugify(fields.title);
		let soundtitle = fields.title;

		let args = [
			'-y', 
			'-i', tempFileName,
			'-c:a', 'libopus', 
			'-b:a', '96k', 
			'-f', 'ogg', process.env.SOUNDS_FOLDER+newFileName+'.ogg'
		];
		
		//Copy as .ogg and remove temp file
		let proc = spawn(cmd, args);
		proc.on('exit', async (err) => {

			if(err){
				console.log('Ogg Transformation Error !');
			}
			else{
				await fs.unlinkSync(tempFileName);

				let sound = { 
					file_name: newFileName+'.ogg',
					display_name: soundtitle
				};
				const addedSound = await dbRequests.addSound(soundtitle, newFileName+'.ogg');
				//console.log(addedSound);
				//client.sounds.set(addedSound);

				res.status(200).send();
			}
		})
	});
});




//Function to normalize name for the file
function slugify (str) {
    var map = {
        '_' : ' |-',
        'a' : 'ä|á|à|ã|â|Ä|À|Á|Ã|Â',
        'e' : 'ë|é|è|ê|Ë|É|È|Ê',
        'i' : 'ï|í|ì|î|Ï|Í|Ì|Î',
        'o' : 'ö|ó|ò|ô|õ|Ö|Ó|Ò|Ô|Õ',
        'u' : 'ú|ù|û|ü|Ú|Ù|Û|Ü',
        'c' : 'ç|Ç',
        'n' : 'ñ|Ñ'
    };
    
    str = str.toLowerCase();
    
    for (var pattern in map) {
        str = str.replace(new RegExp(map[pattern], 'g'), pattern);
	};
	
	var regExpr = /[^a-z0-9_]/g;
	str = str.replace(regExpr, '');
    return str;
};



module.exports = router;