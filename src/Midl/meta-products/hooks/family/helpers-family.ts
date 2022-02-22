import { getFirestore, orderBy } from "firebase/firestore";
import { FirebaseRepository, reorder } from "rxf";
import { TMetaProductFamily } from "../../types";

export const metaProductFamilyRepo = new FirebaseRepository<TMetaProductFamily>(
  "/meta/products/family",
  getFirestore()
);

export async function reorderFamilyHelper(
  userName: string,
  currentIndex: number,
  nextIndex?: number
) {
  const docs = await metaProductFamilyRepo.getAll([orderBy("index")]);

  if ("severity" in docs) return docs;
  else {
    const reordered = reorder(
      docs,
      nextIndex === undefined ? docs.length - 1 : nextIndex,
      currentIndex
    );
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
      await batch.commit();
      return await metaProductFamilyRepo.getAll([orderBy("index")]);
    }
  }
}
