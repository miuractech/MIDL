import * as functions from "firebase-functions";
import { initializeApp } from 'firebase-admin';
import {getAuth} from 'firebase-admin/auth';
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//

const app = initializeApp();

let defaultAuth = getAuth(app);
export const helloWorld = functions.firestore.document('roles/{docId}').onCreate((snapshot, context) => {
    const {docId} =  context.params;
    const data = snapshot.data()  
    const user = defaultAuth.getUserByEmail(data.email)
    if(user.exist){
        switch (data.role) {
            case 'manager':
                user.setCustomeclaim({isManager:true})
                break;
            case 'shipping':
                user.setCustomeclaim({isShipping:true})
                break;
        
            default:
                break;
        }
    }
    
});

export const setUserRoleViaAuth = function.auth.onCreate((user)=>{
    const user = defaultAuth.getUserByEmail(data.email)
    admin.firestore.collection('roles').where('email','==',user.email)
    .get()
    .then(snap=>{
        if(!snap.empty){
            snap.forEach(doc=>{
                const data = doc.data();
                user.setCustomeclaim()
            })
        }
    })
})
