const {
  authenticationUserByEmail,
  getUsersByEmail,
} = require("../../repo/UserRepo");
const APIResponse = require("../../DTO/response/APIResponse");
const HttpStatus = require("../../util/HttpStatus");
const bcrypt = require("bcrypt");
const { getAllCategory } = require("../../repo/CategoryRepo");
const { getAllLearningPath } = require("../../repo/LearningPathRepo");
const { generatePublicUrl } = require("../../config/BusboyConfig");
const { getMentorByEmails } = require("../../repo/MentorRepo");
const { db } = require("../../config/FirebaseConfig");

async function comparePassword(inputPassword, hashedPassword) {
  const isValid = await bcrypt.compare(inputPassword, hashedPassword);
  if (!isValid) {
    throw new Error("Password is wrong");
  }
  return true;
}

// OPTIMASI: Combine user validation dengan password check
async function validateUserAndPassword(email, password) {
  try {
    // Single call untuk mendapatkan user data
    const userData = await getUsersByEmail(email);
    const user = userData[0];

    // Check password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Password is wrong");
    }

    // Check mentor status jika ada
    const mentor = await getMentorByEmails(email);
    if (mentor != false) {
      if (
        mentor[0].status == "PENDING" ||
        mentor[0].status == "REJECTED" ||
        mentor[0].status == "REJECT"
      ) {
        throw new Error("Mentor status is " + mentor[0].status);
      }
    }

    return true;
  }catch (error) {
    throw new Error(error.message);
  }
}

async function mappingLearningPath() {
  try {
    const allLearningPaths = await getAllLearningPath();
    const mapLearningPaths = () => {
      return allLearningPaths.map(element => ({
        ID: element.ID,
        categoryId: element.categoryId,
        name: element.name,
        picture: generatePublicUrl(element.picture), // 👈 Ubah base64 ke URL
      }));
    };
    const data = mapLearningPaths();
    return data;
  }catch (error) {
    throw new Error(error);
  }
}

// OPTIMASI: Parallel operations untuk mapping response
async function mappingToDataResponse(users) {
  // Parallel execution untuk semua data yang dibutuhkan
  const [listAllCategory, learningPath, user] = await Promise.all([
    getAllCategory(),
    mappingLearningPath(),
    getUsersByEmail(users.email),
  ]);

  return {
    categories: listAllCategory,
    learningPath: learningPath,
    token: users.uid,
    role: users.customClaims,
    email: users.email,
    nameUser: user[0].fullName,
    pictureUser: generatePublicUrl(user[0].picture),
  };
}

// OPTIMASI: Main login service dengan maximum parallel operations
async function loginUserService(user, fcmToken) {
  try {
    // Step 1: Parallel authentication dan validation
    const [users] = await Promise.all([
      authenticationUserByEmail(user.email),
      validateUserAndPassword(user.email, user.password),
    ]);

    // Step 2: Parallel data mapping dan FCM token update
    const dataPromise = mappingToDataResponse(users);

    let fcmUpdatePromise = Promise.resolve();
    if (fcmToken) {
      fcmUpdatePromise = (async() => {
        const docRef = await db
          .collection("user")
          .where("email", "==", user.email)
          .limit(1)
          .get();

        if (!docRef.empty) {
          const docId = docRef.docs[0].id;
          await db.collection("user").doc(docId).update({
            fcmToken: fcmToken,
          });
        }
      })();
    }

    // Wait for both operations
    const [data] = await Promise.all([dataPromise, fcmUpdatePromise]);

    // Pastikan fcmToken ditambahkan dalam data response
    data.fcmToken = fcmToken;

    return new APIResponse(
      HttpStatus.OK.code,
      null,
      data,
      HttpStatus.OK.message,
    );
  }catch (error) {
    return new APIResponse(
      HttpStatus.UNAUTHORIZED.code,
      error.message.replace(/^Error:\s*/, ""),
      null,
      HttpStatus.UNAUTHORIZED.message,
    );
  }
}

module.exports = { loginUserService };
