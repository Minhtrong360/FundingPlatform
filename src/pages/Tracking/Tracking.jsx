import { usePostHog } from 'posthog-js/react'
import { useEffect } from 'react'
import { useUser, useLogin } from '../lib/user'

function Tracking() {
    const posthog = usePostHog()
    const login = useLogin()
    const user = useUser()

    useEffect(() => {
        if (user) {
            // Identify sends an event, so you want may want to limit how often you call it
            posthog?.identify(user.id, {
                email: user.email,
            })
            posthog?.group('company', user.company_id)
        }
    }, [posthog, user.id, user.email, user.company_id])

    const loginClicked = () => {
        posthog?.capture('clicked_log_in')
        login()
    }

    return (
        <div className="Tracking">
            {/* Fire a custom event when the button is clicked */}
            <button onClick={() => posthog?.capture('button_clicked')}>Click me</button>
            {/* This button click event is autocaptured by default */}
            <button data-attr="autocapture-button">Autocapture buttons</button>
            {/* This button click event is not autocaptured */}
            <button className="ph-no-capture">Ignore certain elements</button>
            <button onClick={loginClicked}>Login</button>
        </div>
    )
}

export default Tracking