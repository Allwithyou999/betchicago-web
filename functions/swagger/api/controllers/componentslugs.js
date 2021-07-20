const firebaseAdmin = require('firebase-admin');

module.exports.updateComponentSlug  = async (req, res) => {
  try {
		const { root, tag, component } = req.query;
		await firebaseAdmin.database().ref(`/componentSlugs/${root}/${tag}`).update({component});
        res.status(200).send('{ "success": true }');
	} catch (e) {
		res.status(500).send(e);
	}
};





