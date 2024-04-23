import React from 'react'

interface Props {
    readonly title: string
    readonly classes?: string
    readonly children?: any
}

function AInput(props: Props) {
    const { title, classes, children } = props
    return (
        <div className="settings-section">
            <div className="settings-item with-input">
                <h4 className="settings-title">{title}</h4>
                <div className={`settings-item-content ${classes}`}>
                    <div className="settings-input-wrap">{children}</div>
                </div>
            </div>
        </div>
    )
}

export default React.memo(AInput)
