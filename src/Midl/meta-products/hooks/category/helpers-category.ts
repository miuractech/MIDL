import { getFirestore, orderBy } from "firebase/firestore";
import { FirebaseRepository, reorder } from "rxf";

import { TMetaProductCategory } from "../../types";

export const metaProductCategoryRepo =
  new FirebaseRepository<TMetaProductCategory>(
    "/meta/products/category",
    getFirestore()
  );

export async function reorderCategoryHelper(
  userName: string,
  currentIndex: number,
  nextIndex?: number
) {
  const docs = await metaProductCategoryRepo.getAll([orderBy("index")]);

  if ("severity" in docs) return docs;
  else {
    const reordered = reorder(
      docs,
      nextIndex === undefined ? docs.length - 1 : nextIndex,
      currentIndex
    );
    if ("severity" in reordered) return reordered;
    else {
      const batch = metaProductCategoryRepo.createBatch();
      reordered.forEach((r) => {
        r.updatedBy = userName;
        metaProductCategoryRepo.batchCommitUpdate(
          batch,
          { updatedBy: userName, index: r.index },
          r.id
        );
      });
      await batch.commit();
      return await metaProductCategoryRepo.getAll([orderBy("index")]);
    }
  }
}
