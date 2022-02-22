import { getFirestore, orderBy } from "firebase/firestore";
import { FirebaseRepository, reorder } from "rxf";

import { TMetaProductSubCategory } from "../../types";

export const metaProductSubCategoryRepo =
  new FirebaseRepository<TMetaProductSubCategory>(
    "/meta/products/sub_category",
    getFirestore()
  );

export async function reorderSubCategoryHelper(
  userName: string,
  currentIndex: number,
  nextIndex?: number
) {
  const docs = await metaProductSubCategoryRepo.getAll([orderBy("index")]);

  if ("severity" in docs) return docs;
  else {
    const reordered = reorder(
      docs,
      nextIndex === undefined ? docs.length - 1 : nextIndex,
      currentIndex
    );
    if ("severity" in reordered) return reordered;
    else {
      const batch = metaProductSubCategoryRepo.createBatch();
      reordered.forEach((r) => {
        r.updatedBy = userName;
        metaProductSubCategoryRepo.batchCommitUpdate(
          batch,
          { updatedBy: userName, index: r.index },
          r.id
        );
      });
      await batch.commit();
      return await metaProductSubCategoryRepo.getAll([orderBy("index")]);
    }
  }
}
