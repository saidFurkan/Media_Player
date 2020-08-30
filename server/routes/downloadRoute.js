const express = require('express');
const router = express.Router();
const ytdl = require('ytdl-core');

router.get('/mp3', async (req, res, next) => {
	try {
		var url = req.query.url;
		let title = 'audio';

		await ytdl.getBasicInfo(url, {
			format: 'mp4'
		}, (err, info) => {
			if (err) throw err;
			title = info.player_response.videoDetails.title.replace(/[^\x00-\x7F]/g, "");
		});

		res.header('Content-Disposition', `attachment; filename="${title}.mp3"`);
		ytdl(url, {
			format: 'mp3',
			filter: 'audioonly',
		}).pipe(res);

	} catch (err) {
		console.error(err);
	}
});

router.get('/mp4', async (req, res, next) => {
	try {
		let URL = req.query.url;
		let title = 'video';

		await ytdl.getBasicInfo(URL, {
			format: 'mp4'
		}, (err, info) => {
			title = info.player_response.videoDetails.title.replace(/[^\x00-\x7F]/g, "");
		});

		res.header('Content-Disposition', `attachment; filename="${title}.mp4"`);
		ytdl(URL, {
            format: 'mp4',
		}).pipe(res);

	} catch (err) {
		console.error(err);
	}
});


module.exports = router;