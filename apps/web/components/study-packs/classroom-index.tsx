import { ArrowRight } from 'lucide-react';

import { ClassroomShell } from './classroom-shell';
import { CH201_PACK, CH201_VOCABULARY } from '@/lib/study-packs/ch201';

export function ClassroomIndex() {
  return (
    <ClassroomShell
      eyebrow="Current Class"
      title={<>我的課 <span>Current Class</span></>}
      description="Review the vocabulary, patterns, and speaking prompts you have actually encountered in class."
    >
      <section className="classroom-section" aria-labelledby="class-packs-heading">
        <div className="classroom-section-head"><div><span className="eyebrow">Available now</span><h2 id="class-packs-heading">Your class packs</h2></div></div>
        <a className="class-pack-card" href="/classroom/ch201">
          <div><span className="class-pack-mark" lang="zh-Hant">課</span></div>
          <div><span className="eyebrow">{CH201_PACK.sourceContext}</span><h3>{CH201_PACK.title} <span lang="zh-Hant">{CH201_PACK.titleZh}</span></h3><p>{CH201_PACK.description}</p><small>{CH201_PACK.units.length} topic units · {CH201_VOCABULARY.length} weekly vocabulary items</small></div>
          <ArrowRight aria-hidden="true" />
        </a>
      </section>
    </ClassroomShell>
  );
}
