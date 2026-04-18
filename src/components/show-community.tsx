import type { ICommunity } from "~/shared/interfaces/community.interface";

export function ShowCommunity({ community }: { community: ICommunity }) {
  return (
    <div className="flex items-center gap-x-2">
      {community?.cover?.url && (
        <img
          src={community?.cover?.url}
          alt={community?.name}
          className="h-12 w-12 rounded-full border border-gray-50"
        />
      )}
      <a
        href={`${import.meta.env.VITE_CLIENT_URL_MAIN}/communities/${community?.slug}`}
        target="_blank"
        rel="noopener noreferrer"
        className="line-clamp-1 hover:underline"
      >
        {community?.name}
      </a>
    </div>
  );
}
