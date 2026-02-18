import siteData from "@/data/site.json";
import membersData from "@/data/members.json";
import historyData from "@/data/history.json";
import albumsData from "@/data/albums.json";

export type SiteConfig = typeof siteData;

export interface MemberTimeline {
  year: number;
  event: string;
}

export interface Member {
  id: string;
  name: string;
  generation: number;
  branch: string;
  title: string;
  bio: string;
  photo: string;
  birthYear: number;
  highlights: string[];
  parentId: string | null;
  spouseId: string | null;
  childrenIds: string[];
  gender: "M" | "F";
  timeline: MemberTimeline[];
}

export interface MemberWithRelations extends Member {
  parent: Member | null;
  spouse: Member | null;
  children: Member[];
}

export type HistoryEvent = (typeof historyData.events)[number];

export interface Photo {
  src: string;
  caption: string;
  memberIds?: string[];
}

export interface Album {
  id: string;
  title: string;
  date: string;
  category: string;
  cover: string;
  photos: Photo[];
}

export interface FamilyTreeNode {
  member: Member;
  children: FamilyTreeNode[];
}

export function getSiteConfig(): SiteConfig {
  return siteData;
}

export function getMembers(): Member[] {
  return membersData.members as Member[];
}

export function getMemberById(id: string): Member | undefined {
  return (membersData.members as Member[]).find((m) => m.id === id);
}

export function getMembersByGeneration(generation: number): Member[] {
  return (membersData.members as Member[]).filter((m) => m.generation === generation);
}

export function getGenerations(): number[] {
  const gens = new Set(membersData.members.map((m) => m.generation));
  return Array.from(gens).sort();
}

export function getBranches(): string[] {
  const branches = new Set(membersData.members.map((m) => m.branch));
  return Array.from(branches);
}

export function getHistoryEvents(): HistoryEvent[] {
  return historyData.events.sort((a, b) => a.year - b.year);
}

export function getAlbums(): Album[] {
  return (albumsData.albums as Album[]).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getAlbumById(id: string): Album | undefined {
  return (albumsData.albums as Album[]).find((a) => a.id === id);
}

export function getAlbumCategories(): string[] {
  const cats = new Set(albumsData.albums.map((a) => a.category));
  return Array.from(cats);
}

// --- 新增：家族谱系图 + 成员详情页 ---

export function getMemberWithRelations(id: string): MemberWithRelations | undefined {
  const members = getMembers();
  const member = members.find((m) => m.id === id);
  if (!member) return undefined;

  return {
    ...member,
    parent: member.parentId ? members.find((m) => m.id === member.parentId) ?? null : null,
    spouse: member.spouseId ? members.find((m) => m.id === member.spouseId) ?? null : null,
    children: member.childrenIds
      .map((cid) => members.find((m) => m.id === cid))
      .filter((m): m is Member => !!m),
  };
}

export function buildFamilyTree(): FamilyTreeNode[] {
  const members = getMembers();
  const roots = members.filter((m) => !m.parentId);

  function buildNode(member: Member): FamilyTreeNode {
    const children = member.childrenIds
      .map((cid) => members.find((m) => m.id === cid))
      .filter((m): m is Member => !!m)
      .map(buildNode);
    return { member, children };
  }

  return roots.map(buildNode);
}

export function getAlbumsByMemberId(memberId: string): { album: Album; photos: Photo[] }[] {
  const albums = getAlbums();
  const results: { album: Album; photos: Photo[] }[] = [];

  for (const album of albums) {
    const matched = album.photos.filter((p) => p.memberIds?.includes(memberId));
    if (matched.length > 0) {
      results.push({ album, photos: matched });
    }
  }

  return results;
}

export function getAdjacentMembers(id: string): { prev: Member | null; next: Member | null } {
  const members = getMembers();
  const idx = members.findIndex((m) => m.id === id);
  return {
    prev: idx > 0 ? members[idx - 1] : null,
    next: idx < members.length - 1 ? members[idx + 1] : null,
  };
}
