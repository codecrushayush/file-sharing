export function toPublicUser(doc) {
  const u = doc.toObject ? doc.toObject() : doc;
  return {
    id: String(u._id),
    name: u.name,
    email: u.email,
    createdAt: u.createdAt,
  };
}
