const { db, authentications } = require("../config/FirebaseConfig");

async function findEmailIsAlready(email) {
  const docRef = await db.collection("user").where("email", "==", email).get();

  if (!docRef.empty) {
    throw new Error(`${email} is already in use`);
  }
  return true;
}

// Fungsi untuk mendapatkan FCM token berdasarkan ID pengguna
async function getFCMTokenByUserId(userId) {
  try {
    const userDoc = await db.collection("user").doc(userId).get();
    if (!userDoc.exists) {
      throw new Error("User tidak ditemukan");
    }
    return userDoc.data().fcmToken || null;
  }catch (error) {
    throw new Error(`Gagal ambil FCM token: ${error.message}`);
  }
}

async function getUsersByEmail(email) {
  const docRef = await db.collection("user").where("email", "==", email).get();

  if (docRef.empty) {
    throw new Error(`${email} Not Found`);
  }
  return docRef.docs.map(doc => ({
    ...doc.data(),
  }));
}

// OPTIMASI: Batch function untuk mengatasi N+1 query problem
async function getUsersByEmails(emails) {
  if (!emails || emails.length === 0) {
    return [];
  }

  // Remove duplicates
  const uniqueEmails = [...new Set(emails)];

  // Firestore 'in' query limit is 10 items
  const chunks = [];
  for (let i = 0; i < uniqueEmails.length; i += 10) {
    chunks.push(uniqueEmails.slice(i, i + 10));
  }

  try {
    const promises = chunks.map(chunk =>
      db.collection("user").where("email", "in", chunk).get(),
    );

    const results = await Promise.all(promises);
    const users = results.flatMap(snap =>
      snap.docs.map(doc => ({
        ...doc.data(),
      })),
    );

    return users;
  }catch (error) {
    throw new Error(`Failed to get users by emails: ${error.message}`);
  }
}

async function authenticationUserByEmail(email) {
  try {
    return await authentications.getUserByEmail(email);
  }catch (error) {
    throw new Error(`${email} Not found`);
  }
}

async function setPictureUser(email, picture) {
  try {
    const docDb = await db.collection("user");
    const docRef = await docDb.where("email", "==", email).get();
    docRef.forEach(doc => {
      const ref = docDb.doc(doc.id);
      ref.update({ picture: picture });
    });
  }catch (error) {
    throw new Error(error.message);
  }
}

async function editUser(email, dataNew, { picture = null }) {
  try {
    const docRef = await db
      .collection("user")
      .where("email", "==", email)
      .get();

    const dataForUpdate = docRef.docs.map(doc => ({
      id: doc.id,
    }));

    if (picture != null) {
      await db.collection("user").doc(dataForUpdate[0].id).update({
        picture: picture,
        phone: dataNew.phone,
        fullName: dataNew.fullName,
      });
    }else {
      await db.collection("user").doc(dataForUpdate[0].id).update({
        phone: dataNew.phone,
        fullName: dataNew.fullName,
      });
    }
  }catch (error) {
    throw new Error(error.message);
  }
}

async function editUserMentor(email, fullName, picture) {
  try {
    const docRef = await db
      .collection("user")
      .where("email", "==", email)
      .get();

    if (docRef.empty)throw new Error("User not found");

    const userId = docRef.docs[0].id;

    // Buat objek update hanya dengan field yang tidak undefined/null
    const updateData = {};
    if (picture !== undefined) updateData.picture = picture;
    if (fullName !== undefined) updateData.fullName = fullName;

    if (Object.keys(updateData).length === 0)return; // tidak ada data yang perlu diupdate

    await db.collection("user").doc(userId).update(updateData);
  }catch (error) {
    throw new Error(error.message);
  }
}

module.exports = {
  findEmailIsAlready,
  authenticationUserByEmail,
  getUsersByEmail,
  getUsersByEmails, // OPTIMASI: Tambahkan batch function
  setPictureUser,
  editUser,
  editUserMentor,
  getFCMTokenByUserId,
};
