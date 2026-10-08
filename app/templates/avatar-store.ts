const DATABASE_NAME = "resume-builder-media";
const OBJECT_STORE_NAME = "photos";
const AVATAR_KEY = "profile-photo";
const AVATAR_CLEARED_KEY = "profile-photo-cleared";
const AVATAR_CLEARED = "cleared";

function openAvatarDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(DATABASE_NAME, 1);

    request.onupgradeneeded = () => {
      request.result.createObjectStore(OBJECT_STORE_NAME);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function getAvatar(): Promise<Blob | typeof AVATAR_CLEARED | null> {
  const database = await openAvatarDatabase();

  return new Promise((resolve, reject) => {
    const request = database
      .transaction(OBJECT_STORE_NAME, "readonly")
      .objectStore(OBJECT_STORE_NAME)
      .get(AVATAR_KEY);

    request.onsuccess = () => {
      database.close();
      resolve(
        request.result === AVATAR_CLEARED
          ? AVATAR_CLEARED
          : request.result instanceof Blob
            ? request.result
            : null,
      );
    };
    request.onerror = () => {
      database.close();
      reject(request.error);
    };
  });
}

function writeAvatar(photo: Blob | null, cleared = false): Promise<void> {
  return openAvatarDatabase().then(
    (database) =>
      new Promise((resolve, reject) => {
        const transaction = database.transaction(OBJECT_STORE_NAME, "readwrite");
        const store = transaction.objectStore(OBJECT_STORE_NAME);
        store.delete(AVATAR_CLEARED_KEY);

        if (photo) {
          store.put(photo, AVATAR_KEY);
        } else {
          store.delete(AVATAR_KEY);
        }
        if (cleared) store.put(AVATAR_CLEARED, AVATAR_CLEARED_KEY);

        transaction.oncomplete = () => {
          database.close();
          resolve();
        };
        transaction.onerror = () => {
          database.close();
          reject(transaction.error);
        };
        transaction.onabort = () => {
          database.close();
          reject(transaction.error);
        };
      }),
  );
}

export function saveAvatar(photo: Blob): Promise<void> {
  return writeAvatar(photo);
}

export function deleteAvatar(): Promise<void> {
  return writeAvatar(null);
}

export function clearAvatar(): Promise<void> {
  return writeAvatar(null, true);
}