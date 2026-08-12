'use client'

import SectionCard from '../SectionCard'
import JourneyContentEditor from '../JourneyContentEditor'

export default function MessageEditorSection() {
  return (
    <SectionCard title="Message Editor">
      <JourneyContentEditor initialDay={1} />
    </SectionCard>
  )
}
