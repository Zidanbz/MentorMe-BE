
const {db} = require('./config/FirebaseConfig')

const user  = {
    username: "Ahmad Rendi",
    password: "123"
};

async function login () {

}


async function saveUserData() {
    try {
        const data = user;
        const docRef = db.collection('user').doc();  // Membuat dokumen baru di koleksi 'user'
        await docRef.set(data);

        console.log('Data successfully saved!');
    } catch (error) {
        console.log(error);
    }
}

async function getDataUser() {
    try{
        const docRef = await db.collection('user')
            .where ('username', '==', 'Ahmad Rendi')
            .get();
        // const doc = await docRef.get();

        if(docRef.empty){
            console.log("Data Not Found")
        }else {
            docRef.forEach((doc) => {
                console.log(doc.data().username);
                console.log(doc.data().password);
            })
        }

    }catch(error){
        console.log(error);
    }
}

// saveUserData();

module.exports = { user };