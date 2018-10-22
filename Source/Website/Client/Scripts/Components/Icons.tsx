import * as React from 'react'

interface LoadingIconProps extends React.Props<any> {
    className?: string
}

export const LoadingIcon: React.SFC<LoadingIconProps> = props => {
    const { className } = props

    return <i className={`fas fa-spinner fa-spin fa-fw loading-icon ${className}`} />
}

LoadingIcon.defaultProps = {
    className: ''
}

//interface FadingLoadingIconProps extends React.Props<any> {
//    loading: boolean
//    text?: string
//}

//interface FadingLoadingIconState {
//    loading: boolean
//}

//export class FadingLoadingIcon extends React.Component<FadingLoadingIconProps, FadingLoadingIconState> {

//    state = {
//        // Start out as loading=false so that fade-in still happens even if the loading
//        // prop is true moment the component is created.
//        loading: false
//    }

//    componentDidMount() {
//        setTimeout(() => this.setState({ loading: this.props.loading }), 50)
//    }

//    componentWillReceiveProps(nextProps: FadingLoadingIconProps) {
//        this.setState({ loading: nextProps.loading })
//    }

//    render() {
//        const { text } = this.props
//        const { loading } = this.state

//        return <div className={`fading-loading-icon ${loading ? 'loading-active' : ''}`}>
//            <LoadingIcon />
//            {text && (' ' + text)}
//        </div>
//    }
//}

//export function LoadingCover() {
//    return <div className="loading-cover">
//        <div className="flex-container">
//            <LoadingIcon className="gray" />
//        </div>
//    </div>
//}
