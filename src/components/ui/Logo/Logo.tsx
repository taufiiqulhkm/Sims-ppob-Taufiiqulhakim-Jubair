import logoImg from '../../../assets/Logo.png';

const Logo = ({ className }: { className?: string }) => {
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginBottom: '8px'
        }} className={className}>
            <img
                src={logoImg}
                alt="Logo SIMS PPOB"
                style={{
                    width: '32px',
                    height: '32px',
                    objectFit: 'contain'
                }}
            />
            <h2 style={{
                fontSize: '20px',
                fontWeight: '700',
                margin: 0,
                color: '#111827'
            }}>
                SIMS PPOB
            </h2>
        </div>
    );
};

export default Logo;
