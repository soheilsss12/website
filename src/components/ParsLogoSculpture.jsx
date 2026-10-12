import ParsLogoMark from './ParsLogoMark.jsx';

export default function ParsLogoSculpture({ active = true }) {
  return (
    <div className={`pars-logo-sculpture ${active ? 'is-active' : 'is-idle'}`} aria-hidden="true">
      <div className="pars-logo-sculpture__float">
        <div className="pars-logo-sculpture__model">
          <span className="pars-logo-sculpture__shadow" />
          <span className="pars-logo-sculpture__prism pars-logo-sculpture__prism--rear" />
          <span className="pars-logo-sculpture__prism pars-logo-sculpture__prism--front" />
          <span className="pars-logo-sculpture__shard pars-logo-sculpture__shard--violet" />
          <span className="pars-logo-sculpture__shard pars-logo-sculpture__shard--indigo" />
          <span className="pars-logo-sculpture__shard pars-logo-sculpture__shard--blue" />
          <span className="pars-logo-sculpture__shard pars-logo-sculpture__shard--cyan" />
          <div className="pars-logo-sculpture__face">
            <span className="pars-logo-sculpture__glint" />
            <ParsLogoMark animated decorative className="hero-brand-mark pars-logo-mark--depth" />
          </div>
        </div>
      </div>
    </div>
  );
}
