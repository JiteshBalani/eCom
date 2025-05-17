import { useSelector } from 'react-redux'
import { Spin } from 'antd';

const Loader = () => {

    const isLoading = useSelector((state) => state.loader.isLoading);    

  return isLoading ? (
    <div style = {{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'rgba(0, 102, 255, 0.1)',
        zIndex: 1000
    }}>
    <Spin size='large' tip='Loading...' fullscreen/>

    </div>
  ) : null;
}

export default Loader