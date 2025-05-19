// System
import { cx } from "class-variance-authority"
import { twMerge } from "tailwind-merge"
import { useRef, useState } from "react"
// Service
import { useFetchAndStoreData } from "@/service/fetcher"
// Ui
import ImageButton from "@/ui/Actions/ImageButton"
import PortalPopupAppearTransition from "@/ui/Skeleton/Transition/PortalPopupAppearTransition"
// Styles and types
import { PlayerFramePortraitProps, PlayerFrameSelectProps } from "./types"
import { PlayerInfo } from "@/constants/types/players"

/**
 * Displays a selectable player portrait frame.
 * It allows users to select a player from a list, excluding specified player IDs.
 * The component fetches the list of players from the API.
 *
 * @param {string} [props.className] - Additional CSS classes to apply to the root element.
 * @param {string} props.characterId - The ID of the character for which to fetch players.
 * @param {string | undefined} props.selectedPlayerId - The currently selected player's ID.
 * @param {(player?: PlayerInfo) => void} [props.onPlayerSelect] - Callback invoked when a player is selected or cleared.
 * @param {string[]} [props.playersIdsToExclude] - Array of player IDs to exclude from the selection list.
 */
function PlayerFrameSelect({
  className,
  characterId,
  selectedPlayerId,
  onPlayerSelect,
  playersIdsToExclude = []
}: PlayerFrameSelectProps) {
  const calculatedClassNames = cx(
    twMerge("player-frame-select w-32 h-32", className)
  )
  const [isSelectPlayersOpen, setIsSelectPlayersOpen] = useState(false)
  const [selectPlayerPosition, setSelectPlayerPosition] = useState<
    DOMRect | undefined
  >(undefined)
  const selectPlayerRef = useRef<HTMLDivElement>(null)
  const [players] = useFetchAndStoreData<PlayerInfo[]>(
    "/api/dictionary/players",
    null,
    characterId
  )
  const selectedPlayer = players?.find(
    (player) => player.id === selectedPlayerId
  )
  const handleOpenPlayerSelect = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    if (selectPlayerRef.current) {
      setSelectPlayerPosition(selectPlayerRef.current.getBoundingClientRect())
    }
    setIsSelectPlayersOpen(true)
  }
  const handleSelectPlayer = (
    e: React.MouseEvent<HTMLDivElement>,
    player?: PlayerInfo
  ) => {
    e.stopPropagation()
    setIsSelectPlayersOpen(false)
    if (onPlayerSelect) {
      onPlayerSelect(player)
    }
  }
  return (
    <div className={calculatedClassNames} ref={selectPlayerRef}>
      <PlayerFramePortrait
        player={selectedPlayer}
        onClick={handleOpenPlayerSelect}
      />
      <PortalPopupAppearTransition
        isActive={isSelectPlayersOpen}
        onClose={() => setIsSelectPlayersOpen(false)}
        parentPositionSettings={selectPlayerPosition}
        positionDirection="bottom"
        positionVerticalOffset={10}
        autoReposition
        mask
      >
        <div className="player-frame-select-popup flex gap-close flex-wrap max-w-96 w-fit">
          {selectedPlayer && (
            <div className="w-24 h-24">
              <PlayerFramePortrait
                defaultTitle="Empty"
                onClick={handleSelectPlayer}
                isUsingOnlyDescription
              />
            </div>
          )}
          {players?.map((player) => {
            if (
              player.id === selectedPlayerId ||
              playersIdsToExclude?.includes(player.id)
            ) {
              return null
            }
            return (
              <div key={player.id} className="w-24 h-24">
                <PlayerFramePortrait
                  player={player}
                  onClick={handleSelectPlayer}
                  isUsingOnlyDescription
                />
              </div>
            )
          })}
        </div>
      </PortalPopupAppearTransition>
    </div>
  )
}

/**
 * Renders a player portrait frame with an image and name/description.
 *
 * @param {string} [props.className] - Additional CSS class names to apply to the container.
 * @param {Player | undefined} [props.player] - The player object containing image and name information.
 * @param {(player?: Player) => void} [props.onClick] - Callback invoked when the portrait is clicked, receiving the player as an argument.
 * @param {string} [props.defaultTitle="Player"] - The default title to display if no player is provided.
 * @param {string} [props.defaultDescription="Click to change"] - The default description to display if no player is provided.
 * @param {boolean} [props.isUsingOnlyDescription] - If true, only the player's name is shown as the description; otherwise, the name is used as the title and the description is shown.
 * @returns {JSX.Element} The rendered player portrait frame component.
 */
function PlayerFramePortrait({
  className,
  player,
  onClick,
  defaultTitle = "Player",
  defaultDescription = "Click to change",
  isUsingOnlyDescription
}: PlayerFramePortraitProps) {
  const calculatedClassNames = cx(twMerge("player-frame-portrait", className))
  const playerImage = player?.image || "/public/images/silhouette.png"
  const playerName = player
    ? player.shortname || player.name.split(" ")[0]
    : defaultTitle
  return (
    <div className={calculatedClassNames} onClick={(e) => onClick?.(e, player)}>
      <ImageButton
        alt="select"
        src={playerImage}
        title={isUsingOnlyDescription ? undefined : playerName}
        description={isUsingOnlyDescription ? playerName : defaultDescription}
      />
    </div>
  )
}

export default PlayerFrameSelect
