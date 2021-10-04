import bcrypt from "bcryptjs";
import User from '../User';

const UserAfterUpdate = async ( model: any, next: any) => {

  const oldDoc: any = await User.findById(model._conditions._id);
  const newDoc: any = model._update

  if ( newDoc.fullName !== null && oldDoc.fullName !== newDoc.fullName  ) {
    console.log("====================> Name-Change")
    try{
      await User.updateOne({ _id: oldDoc._id },
        { $addToSet: {history: {
          event: "NAME_CHANGE",
          oldValue: oldDoc.fullName,
          newValue: newDoc.fullName,
          createdAt: new Date()
      }}})
    }catch (e) {
      return next(e);
    }
  }

  if (newDoc.address && oldDoc.address !== newDoc.address){
    try{
      await User.updateOne({ _id: oldDoc._id },
        {$addToSet: {history: {
          event: "ADDRESS_CHANGE",
          oldValue: oldDoc.address,
          newValue: newDoc.address,
          createdAt: new Date()
        }}
        })
    }catch (e) {
      return next(e);
    }
  }

  if (newDoc.password && oldDoc.password !== newDoc.password){
    try{
      const salt = await bcrypt.genSalt(10);
      newDoc.password = await bcrypt.hash(newDoc.password, salt);
      await User.updateOne({ _id: oldDoc._id },
        {
          password: newDoc.password,
          $addToSet: {
            history: {
              event: "PASSWORD_CHANGE",
              createdAt: new Date()
            }
          }
        })
    }catch (e) {
      return next(e);
    }
  }
};

export default UserAfterUpdate;