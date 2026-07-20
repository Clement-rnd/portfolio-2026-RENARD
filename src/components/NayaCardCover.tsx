import phoneSplash from "../assets/images/naya/cover/phone-splash.jpg";
import phoneHome from "../assets/images/naya/cover/phone-home.jpg";
import phoneDetails from "../assets/images/naya/cover/phone-details.jpg";
import { Squircle } from "./Squircle";

// Static equivalent of NayaCoverHero for the homepage project card — same
// screens/positions, but instead of a scroll-triggered reveal, hovering the
// card (via the parent Link's `group`) fans the 3 phones apart slightly.
// The base position/centering is set via the `translate` CSS property (kept
// constant), while the fan-out + tilt live entirely in `transform` behind a
// `--fan` custom property so Tailwind's `group-hover:` can drive it with a
// plain CSS transition — no JS needed.
const PHONES = [
  {
    src: phoneSplash,
    leftPct: 31,
    className: "[--fan:0px] [--tilt:-4deg] group-hover:[--fan:-22px] group-hover:[--tilt:-9deg]",
  },
  {
    src: phoneHome,
    leftPct: 50.34,
    className: "[--fan:0px] [--tilt:0deg] group-hover:[--fan:0px] group-hover:[--tilt:0deg]",
  },
  {
    src: phoneDetails,
    leftPct: 69.68,
    className: "[--fan:0px] [--tilt:4deg] group-hover:[--fan:22px] group-hover:[--tilt:9deg]",
  },
];

const WIDTH_PCT = 18;
// Top edge of every phone sits at this fixed distance from the top of the
// card cover, regardless of screen size.
const TOP_PCT = 15;

export function NayaCardCover() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-white">
      {PHONES.map((phone) => (
        <div
          key={phone.src}
          className={`absolute transition-transform duration-500 ease-out ${phone.className}`}
          style={{
            left: `${phone.leftPct}%`,
            top: `${TOP_PCT}%`,
            width: `${WIDTH_PCT}%`,
            aspectRatio: "393 / 852",
            transform:
              "translate(calc(-50% + var(--fan)), 0%) rotate(var(--tilt))",
            filter: "drop-shadow(0px 12px 30px rgba(0,0,0,0.12))",
          }}
        >
          <Squircle
            cornerRadius={22}
            cornerSmoothing={1}
            borderWidth={0}
            className="h-full w-full"
          >
            <img
              src={phone.src}
              alt=""
              className="h-full w-full object-cover"
            />
          </Squircle>
        </div>
      ))}
    </div>
  );
}
