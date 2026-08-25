import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import { motion, type PanInfo } from "framer-motion";
import { Polaroid } from "../components/Polaroid";
import { Section } from "../components/Section";
import { content } from "../content";
import { reducedMotion, SPRING } from "../lib/motion";
import { seeded } from "../lib/seededRandom";

const TAP_THRESHOLD = 8;
const SWIPE_THRESHOLD = 60;

interface PointerStart {
  id: string;
  x: number;
  y: number;
  moved: boolean;
}

function itemId(src: string, index: number) {
  return `${src}-${index}`;
}

// A jittered grid, not a free scatter: every card owns a cell, then gets a
// small seeded nudge and its rotation. With 13 portrait cards a true random
// scatter degenerates into piles; this keeps the scrapbook look usable.
const BOARD_COLS = 5;
const BOARD_ROW_HEIGHT = 430;

const boardRows = Math.ceil(content.polaroids.length / BOARD_COLS);
const boardHeight = boardRows * BOARD_ROW_HEIGHT + 130;

function boardPosition(id: string, index: number) {
  const col = index % BOARD_COLS;
  // Stagger odd rows by half a cell so columns don't read as strict lines.
  const row = Math.floor(index / BOARD_COLS);
  const colShift = row % 2 === 1 ? 9 : 0;
  // Cap so a staggered last column never hangs off the board's right edge.
  const left = Math.min(2 + col * 18.4 + colShift + seeded(`${id}-x`) * 3.5, 75);
  return {
    left: `${left}%`,
    top: `${28 + row * BOARD_ROW_HEIGHT + seeded(`${id}-y`) * 46}px`,
  };
}

export function S4_PolaroidWall() {
  const boardRef = useRef<HTMLDivElement>(null);
  const pointerStart = useRef<PointerStart | null>(null);
  const topZ = useRef(content.polaroids.length + 10);
  const [flippedIds, setFlippedIds] = useState<Set<string>>(() => new Set());
  const [zOrder, setZOrder] = useState<Record<string, number>>({});
  const [activeIndex, setActiveIndex] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(() => window.innerWidth);
  const signature = content.you.name.charAt(0);

  useEffect(() => {
    const updateWidth = () => setViewportWidth(window.innerWidth);
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  function toggleFlip(id: string) {
    setFlippedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function bringToFront(id: string) {
    topZ.current += 1;
    setZOrder((current) => ({ ...current, [id]: topZ.current }));
  }

  function handlePointerDown(id: string, event: PointerEvent<HTMLDivElement>) {
    pointerStart.current = {
      id,
      x: event.clientX,
      y: event.clientY,
      moved: false,
    };
    bringToFront(id);
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const start = pointerStart.current;
    if (!start || start.moved) {
      return;
    }

    const distance = Math.hypot(
      event.clientX - start.x,
      event.clientY - start.y,
    );
    if (distance >= TAP_THRESHOLD) {
      start.moved = true;
    }
  }

  function markAsDragged() {
    if (pointerStart.current) {
      pointerStart.current.moved = true;
    }
  }

  function handlePointerUp(id: string) {
    const start = pointerStart.current;
    if (start?.id === id && !start.moved) {
      toggleFlip(id);
    }
    pointerStart.current = null;
  }

  function handleKeyDown(id: string, event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      bringToFront(id);
      toggleFlip(id);
    }
  }

  function handleSwipe(_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) {
    if (info.offset.x <= -SWIPE_THRESHOLD) {
      setActiveIndex((current) =>
        Math.min(content.polaroids.length - 1, current + 1),
      );
    } else if (info.offset.x >= SWIPE_THRESHOLD) {
      setActiveIndex((current) => Math.max(0, current - 1));
    }
  }

  const mobileCardWidth = Math.min(viewportWidth * 0.78, 360);
  const neighborOffset = Math.max(0, mobileCardWidth - 16);

  return (
    <section
      id="polaroid-wall"
      className="relative overflow-hidden bg-paper px-4 py-24 md:px-8 md:py-32"
    >
      <Section className="relative z-10 mx-auto mb-12 max-w-3xl text-center md:mb-14">
        <div>
          {/* SPEC-silent: used the scene name as the simplest wall heading. */}
          <h2 className="font-display text-display leading-none text-cherry">
            The Polaroid Wall
          </h2>
          <p className="mt-4 font-handwriting text-xl text-ink/65 md:hidden">
            swipe. tap one to read the back.
          </p>
          <p className="mt-4 hidden font-handwriting text-2xl text-ink/65 md:block">
            tap one to read what&apos;s on the back. drag them around, too.
          </p>
        </div>
      </Section>

      <div
        ref={boardRef}
        data-testid="desktop-polaroid-board"
        className="polaroid-board relative mx-auto hidden max-w-7xl overflow-hidden rounded-2xl border border-cherry/15 shadow-[inset_0_0_60px_rgb(43_27_18_/_0.08)] md:block"
        style={{ height: boardHeight }}
      >
        {content.polaroids.map((item, index) => {
          const id = itemId(item.src, index);
          const position = boardPosition(id, index);
          const flipped = flippedIds.has(id);

          return (
            <motion.div
              key={id}
              data-layout="desktop"
              data-polaroid-id={id}
              className="absolute w-[clamp(190px,22vw,270px)] cursor-grab touch-none active:cursor-grabbing"
              style={{
                ...position,
                zIndex: zOrder[id] ?? index + 1,
              }}
              drag
              dragConstraints={boardRef}
              dragMomentum={false}
              whileDrag={
                reducedMotion
                  ? { zIndex: topZ.current + 1 }
                  : {
                      scale: 1.04,
                      zIndex: topZ.current + 1,
                      boxShadow: "0 18px 45px rgb(43 27 18 / 0.28)",
                    }
              }
              onDragStart={markAsDragged}
              onPointerDown={(event) => handlePointerDown(id, event)}
              onPointerMove={handlePointerMove}
              onPointerUp={() => handlePointerUp(id)}
              onPointerCancel={() => {
                pointerStart.current = null;
              }}
              onKeyDown={(event) => handleKeyDown(id, event)}
              role="button"
              tabIndex={0}
              aria-label={`Flip polaroid, ${item.caption}`}
              aria-pressed={flipped}
            >
              <Polaroid
                id={id}
                src={item.src}
                caption={item.caption}
                aspect={item.aspect}
                backNote={item.backNote}
                signature={signature}
                flipped={flipped}
              />
            </motion.div>
          );
        })}
      </div>

      <div
        data-testid="mobile-polaroid-stack"
        className="relative mx-auto h-[540px] max-w-xl overflow-hidden md:hidden"
      >
        {content.polaroids.map((item, index) => {
          const id = itemId(item.src, index);
          const relativeIndex = index - activeIndex;
          const isActive = relativeIndex === 0;
          const isNeighbor = Math.abs(relativeIndex) === 1;
          const flipped = flippedIds.has(id);

          return (
            <motion.div
              key={id}
              data-layout="mobile"
              data-polaroid-id={id}
              className="absolute inset-x-0 top-8 mx-auto w-[78vw] max-w-[360px]"
              style={{
                zIndex: isActive ? zOrder[id] ?? 20 : 10 - Math.abs(relativeIndex),
                pointerEvents: isActive ? "auto" : "none",
                touchAction: "pan-y",
              }}
              initial={false}
              animate={{
                x: relativeIndex * neighborOffset,
                scale: isActive ? 1 : 0.94,
                opacity: isActive || isNeighbor ? 1 : 0,
              }}
              transition={reducedMotion ? { duration: 0 } : SPRING.card}
              drag={isActive ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragMomentum={false}
              dragElastic={0.18}
              onDragStart={markAsDragged}
              onDragEnd={handleSwipe}
              onPointerDown={(event) => handlePointerDown(id, event)}
              onPointerMove={handlePointerMove}
              onPointerUp={() => handlePointerUp(id)}
              onPointerCancel={() => {
                pointerStart.current = null;
              }}
              onKeyDown={(event) => handleKeyDown(id, event)}
              role="button"
              tabIndex={isActive ? 0 : -1}
              aria-label={`Flip polaroid, ${item.caption}`}
              aria-pressed={flipped}
              aria-hidden={!isActive && !isNeighbor}
            >
              <Polaroid
                id={`${id}-mobile`}
                src={item.src}
                caption={item.caption}
                aspect={item.aspect}
                backNote={item.backNote}
                signature={signature}
                flipped={flipped}
              />
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
