import { Fragment } from 'react'
import { useNotificationPrefs } from '@/components/hooks/useNotificationPrefs'
import { NotificationSection } from '@/components/profile/notificationSection'
import { NOTIFICATION_SECTIONS } from '@/constants/data'
import { Separator } from '@/components/ui/separator'

const Notification = () => {
  const { prefs, changed, handleToggle, handleSave, isSaving } = useNotificationPrefs();

  return (
    <section className="mt-0 p-8">
      <div className="space-y-8">
        {NOTIFICATION_SECTIONS.map((section, i) => (
          <Fragment key={section.id}>
            {i > 0 && <Separator />}
            <NotificationSection
              section={section}
              prefs={prefs}
              onToggle={handleToggle}
              changed={i === 0 ? changed : undefined}
              onSave={i === 0 ? handleSave : undefined}
              isSaving={i === 0 ? isSaving : undefined}
            />
          </Fragment>
        ))}
      </div>
    </section>
  )
}

export default Notification