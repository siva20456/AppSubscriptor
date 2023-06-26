import ORENT_VIEW from '../../ORENT_VIEW.mp4'

const LoadingLogoView = () => (
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',alignSelf:'center'}}>  
      <video autoPlay loop muted width="40%" height='100%'>
        <source src={ORENT_VIEW} type="video/mp4" />
      </video>
    </div>
)

export default LoadingLogoView