const {db} = require("../config/FirebaseConfig");
const Role = require("../entity/Role");

async function getRole(roleId) {
    try {
        const docRef = await db.collection("role")
            .where('ID', '==', roleId)
            .get();

        let roleName = null;
        docRef.forEach((doc) => {
            roleName = doc.data().name;
        });

        if (!roleName) {
            new Error("Role not found");
        }
        return new Role(roleId, roleName);
    } catch (error) {
        throw new Error(`Failed to fetch role: ${error.message}`);
    }
}

module.exports = {getRole}