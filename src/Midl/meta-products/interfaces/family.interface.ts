import { orderBy, runTransaction, where } from "firebase/firestore";

import { firestore } from "../../../config/firebase.config";
import { ApplicationError, FirebaseRepository, reorder } from "../../../lib";
import { TMetaProductFamily } from "../types";
import { DefaultErrorMessage, MetaProductFamilyLimit } from "../settings";

const metaProductFamilyRepo = new FirebaseRepository<TMetaProductFamily>(
  "/meta/products/family",
  firestore,
  DefaultErrorMessage
);

/**
 *
 * Fetches All the Families in MetaProduct
 *
 * @example
 * ```
 * import React from "react";
 * import { useDispatch, useSelector } from "react-redux";
 *
 * import { TApplicationErrorObject, useFetchDataOnMount } from "../../../../lib";
 * import { RootState } from "../../../../store";
 * import IsAdmin from "../../../auth/components/is-admin";
 * import { MetaProductFamilyDBInterface } from "../../interfaces";
 * import {
 *   setMetaProductFamilies,
 *   setMetaProductFamilyFetchError,
 * } from "../../store/meta-product.family.slice";
 * import { TMetaProductFamily } from "../../types";
 *
 * const { getAllFamilies } = MetaProductFamilyDBInterface();
 *
 * const GetAllFamilies: React.FC = () => {
 *   return (
 *     <IsAdmin
 *       LoadingRenderProp={() => <h1>Loading</h1>}
 *       NotSignedInRenderProp={() => <h1>Not Signed In</h1>}
 *       NotAdminRenderProp={() => <h1>Not Admin</h1>}
 *       AdminRenderProp={() => <AllFamiliesWrapper />}
 *     />
 *   );
 * };
 *
 * const AllFamiliesWrapper: React.FC = () => {
 *   const { metaProductFamilies, fetchError } = useSelector(
 *     (state: RootState) => state.metaProductFamily
 *   );
 *   const dispatch = useDispatch();
 *
 *   function familiesStateUpdateCallback(
 *     res: Array<TMetaProductFamily> | TApplicationErrorObject
 *   ) {
 *     if ("severity" in res) dispatch(setMetaProductFamilyFetchError(res));
 *     else {
 *       dispatch(setMetaProductFamilies(res));
 *       dispatch(setMetaProductFamilyFetchError(null));
 *     }
 *   }
 *
 *   useFetchDataOnMount<Array<TMetaProductFamily>, TApplicationErrorObject>(
 *     getAllFamilies,
 *     familiesStateUpdateCallback
 *   );
 *
 *   return (
 *     <React.Fragment>
 *       {metaProductFamilies.map((m) => (
 *         <h1 key={m.id}>{m.name}</h1>
 *       ))}
 *       {fetchError !== null && (
 *         <span style={{ color: "red" }}>{fetchError.message}</span>
 *       )}
 *     </React.Fragment>
 *   );
 * };
 *
 * export default GetAllFamilies;
 * ```
 *
 */
function getAllFamilies() {
  return metaProductFamilyRepo.getAll([orderBy("createdAt")]);
}

function fetchFamilyById(docId: string) {
  return metaProductFamilyRepo.getOne(docId);
}

/**
 *
 * Adds A New Family to the MetaProductFamily
 *
 * @example
 * ```
 *
 * import { User } from "firebase/auth";
 * import { useForm } from "react-hook-form";
 * import { yupResolver } from "@hookform/resolvers/yup";
 * import * as yup from "yup";
 * import { v4 as uuidv4 } from "uuid";
 *
 * import IsAdmin from "../../../auth/components/is-admin";
 * import { MetaProductFamilyDBInterface } from "../../interfaces";
 * import { from } from "rxjs";
 * import { useDispatch, useSelector } from "react-redux";
 * import {
 *   setAddedMetaProductFamily,
 *   setMetaProductFamilyAddError,
 * } from "../../store/meta-product.family.slice";
 * import { RootState } from "../../../../store";
 * import React from "react";
 *
 * const { addNewFamily } = MetaProductFamilyDBInterface();
 *
 * const validationSchema = yup.object({
 *   name: yup
 *     .string()
 *     .max(15, "Exceeding Max Character Limit of 200")
 *     .required("This Name Field is Required"),
 * });
 *
 * const AddFamily: React.FC = () => {
 *   return (
 *     <IsAdmin
 *       LoadingRenderProp={() => <h1>Loading</h1>}
 *       NotSignedInRenderProp={() => <h1>Not Signed In</h1>}
 *       NotAdminRenderProp={() => <h1>Not Admin</h1>}
 *       AdminRenderProp={(props) => <FormWrapper user={props.user} />}
 *     />
 *   );
 * };
 *
 * const FormWrapper: React.FC<{ user: User }> = (props) => {
 *   const { metaProductFamilies, addError } = useSelector(
 *     (state: RootState) => state.metaProductFamily
 *   );
 *   const [showForm, setShowForm] = React.useState(true);
 *
 *   return (
 *     <React.Fragment>
 *       <button onClick={() => setShowForm((val) => !val)}>
 *         {showForm ? "Hide" : "Show"}
 *       </button>
 *       {metaProductFamilies.map((m) => (
 *         <h1 key={m.id}>{m.name}</h1>
 *       ))}
 *       {showForm ? <AddForm user={props.user} mounted={showForm} /> : null}
 *       {addError !== null && (
 *         <span style={{ color: "red" }}>{addError.message}</span>
 *       )}
 *     </React.Fragment>
 *   );
 * };
 *
 * const AddForm: React.FC<{ user: User; mounted: boolean }> = (props) => {
 *   const {
 *     register,
 *     handleSubmit,
 *     formState: { errors },
 *   } = useForm<{ name: string }>({
 *     resolver: yupResolver(validationSchema),
 *   });
 *   const dispatch = useDispatch();
 *   const [sendingRequest, setSendingRequest] = React.useState(false);
 *
 *   function submit(data: { name: string }) {
 *     setSendingRequest(true);
 *     if (props.user.displayName !== null) {
 *       const obs$ = from(
 *         addNewFamily(
 *           { name: data.name, createdBy: props.user?.displayName },
 *           uuidv4()
 *         )
 *       );
 *       const sub = obs$.subscribe((val) => {
 *         setSendingRequest(false);
 *         if ("severity" in val) dispatch(setMetaProductFamilyAddError(val));
 *         else {
 *           dispatch(setAddedMetaProductFamily(val));
 *           dispatch(setMetaProductFamilyAddError(null));
 *         }
 *       });
 *       if (!props.mounted) sub.unsubscribe();
 *     }
 *   }
 *   return (
 *     <form onSubmit={handleSubmit(submit)}>
 *       <input {...register("name")} />
 *       <span style={{ color: "red" }}>{errors.name?.message}</span>
 *       <button onClick={() => handleSubmit(submit)}>Submit</button>
 *       {sendingRequest ? <p>sending request, please wait</p> : null}
 *     </form>
 *   );
 * };
 *
 * export default AddFamily;
 *
 *
 * ```
 *
 */
async function addNewFamily(
  payload: { name: string; createdBy: string },
  docId: string
) {
  const res = await runTransaction(firestore, async () => {
    const docs = await metaProductFamilyRepo.getAll([]);

    if ("severity" in docs) return docs;
    else if (
      docs.length < MetaProductFamilyLimit &&
      docs.filter((d) => d.name === payload.name).length === 0
    ) {
      const writeable: TMetaProductFamily = {
        id: docId,
        name: payload.name,
        index: docs.length,
        createdBy: payload.createdBy,
        updatedBy: payload.createdBy,
        status: "published",
      };

      return metaProductFamilyRepo.createOne(writeable, docId);
    } else {
      return new ApplicationError().handleDefaultError(
        "Conflict/Limit",
        "Naming Conflicts or Limit of Documents has Exceeded",
        "error"
      );
    }
  });
  return res;
}

/**
 *
 * Updates the Family Name
 *
 * Literally the Same Concept as Add
 *
 */
function updateFamily(
  payload: { name: string; updatedBy: string },
  docId: string
) {
  return metaProductFamilyRepo.updateOne(payload, docId);
}

/**
 *
 * Marks the Family as "deleted"
 *
 * Bind this Function to a Button called "Delete" and Pass the DocId
 * that You will Have access to in the Component
 *
 */
function deleteFamily(docId: string) {
  return metaProductFamilyRepo.updateOne({ status: "deleted" }, docId);
}

async function fetchFamilyByName(name: string) {
  const res = await metaProductFamilyRepo.getAll([where("name", "==", name)]);
  if ("severity" in res) return res;
  else {
    if (res.length === 1) return res[0];
    else return new ApplicationError().handleDocumentNotFound();
  }
}

/**
 *
 * Changes the Index of the Selected Document, Taking in the CurrentIndex of the Doc and The Next and
 * Reorders All the Families by the Index Field
 *
 * @example
 *
 * ```
 * import * as yup from "yup";
 *
 * import { User } from "firebase/auth";
 * import IsAdmin from "../../../auth/components/is-admin";
 * import { useForm } from "react-hook-form";
 * import { yupResolver } from "@hookform/resolvers/yup";
 * import { TMetaProductFamily } from "../../types";
 * import { MetaProductFamilyDBInterface } from "../../interfaces";
 * import { from } from "rxjs";
 * import { useDispatch } from "react-redux";
 * import {
 *   setMetaProductFamilies,
 *   setMetaProductFamilyEditError,
 * } from "../../store/meta-product.family.slice";
 * import React from "react";
 *
 * const validationSchema = yup.object({
 *   currentIndex: yup.number().required("This Index Field is Required"),
 *   nextIndex: yup.number().required("This Index Field is Required"),
 * });
 *
 * const { reorderFamily } = MetaProductFamilyDBInterface();
 *
 * const ReorderFamily: React.FC<{ family: TMetaProductFamily }> = ({
 *   family,
 * }) => {
 *   const [showForm, setShowForm] = React.useState(true);
 *
 *   return (
 *     <div>
 *       <button onClick={() => setShowForm((val) => !val)}>
 *         {showForm ? "Hide" : "Show"}
 *       </button>
 *       {showForm ? (
 *         <IsAdmin
 *           LoadingRenderProp={() => <h1>Loading</h1>}
 *           NotSignedInRenderProp={() => <h1>Not Signed In</h1>}
 *           NotAdminRenderProp={() => <h1>Not Admin</h1>}
 *           AdminRenderProp={(props) => (
 *             <FormWrapper user={props.user} family={family} mounted={showForm} />
 *           )}
 *         />
 *       ) : null}
 *     </div>
 *   );
 * };
 *
 * const FormWrapper: React.FC<{
 *   user: User;
 *   family: TMetaProductFamily;
 *   mounted: boolean;
 * }> = ({ user, family, mounted }) => {
 *   const {
 *     register,
 *     handleSubmit,
 *     formState: { errors },
 *   } = useForm<{ currentIndex: number; nextIndex: number }>({
 *     resolver: yupResolver(validationSchema),
 *   });
 *
 *   const dispatch = useDispatch();
 *
 *   function submit(data: { currentIndex: number; nextIndex: number }) {
 *     if (user.displayName !== null) {
 *       const obs$ = from(
 *         reorderFamily(data.nextIndex, data.currentIndex, user.displayName)
 *       );
 *       const sub = obs$.subscribe((val) => {
 *         if ("severity" in val) dispatch(setMetaProductFamilyEditError(val));
 *         else {
 *           dispatch(setMetaProductFamilies(val));
 *           dispatch(setMetaProductFamilyEditError(null));
 *         }
 *       });
 *       if (!mounted) sub.unsubscribe();
 *     }
 *   }
 *
 *   return (
 *     <div>
 *       <form onSubmit={handleSubmit(submit)}>
 *         <input {...register("currentIndex")} defaultValue={family.index} />
 *         <input {...register("nextIndex")} />
 *         <button onClick={() => handleSubmit(submit)}>Submit</button>
 *       </form>
 *     </div>
 *   );
 * };
 *
 * export default ReorderFamily;
 *
 *
 * ```
 *
 *
 */
async function reorderFamily(
  nextIndex: number,
  currentIndex: number,
  userName: string
) {
  const res = await runTransaction(firestore, async () => {
    const docs = await metaProductFamilyRepo.getAll([orderBy("index")]);

    if ("severity" in docs) return docs;
    else {
      const reordered = reorder(docs, nextIndex, currentIndex);
      if ("severity" in reordered) return reordered;
      else {
        const batch = metaProductFamilyRepo.createBatch();
        reordered.forEach((r) => {
          r.updatedBy = userName;
          metaProductFamilyRepo.batchCommitUpdate(
            batch,
            { updatedBy: userName, index: r.index },
            r.id
          );
        });
        batch.commit();
        return await metaProductFamilyRepo.getAll([orderBy("index")]);
      }
    }
  });
  return res;
}

export interface TMetaProductFamilyDBInterface {
  getAllFamilies: typeof getAllFamilies;
  fetchFamilyById: typeof fetchFamilyById;
  fetchFamilyByName: typeof fetchFamilyByName;
  addNewFamily: typeof addNewFamily;
  updateFamily: typeof updateFamily;
  deleteFamily: typeof deleteFamily;
  reorderFamily: typeof reorderFamily;
}

/**
 *
 * Requires Admin Level Privileges to Use
 *
 */
export function MetaProductFamilyDBInterface(): TMetaProductFamilyDBInterface {
  return {
    getAllFamilies,
    fetchFamilyById,
    fetchFamilyByName,
    addNewFamily,
    updateFamily,
    deleteFamily,
    reorderFamily,
  };
}
