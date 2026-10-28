// 패치 노트 목록 (기록이 커서 창을 열 때 받음: lazyScreens)
import type { Lang } from "../i18n";
import { PATCH_NOTES } from "../patchNotes";

export function PatchNotesList({ lang }: { lang: Lang }) {
  return PATCH_NOTES.map((note) => (
    <section key={note.version}>
      <h3>
        {note.version} <small>{note.date}</small>
      </h3>
      <ul>
        {note.items[lang].map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  ));
}
