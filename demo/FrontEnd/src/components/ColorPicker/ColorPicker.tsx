import { Circle } from '@uiw/react-color';
import styles from './ColorPicker.module.css';

export default function ColorPicker({
  color,
  setColor,
}: {
  color: string;
  setColor: (color: string) => void;
}) {
  return (
    <div className={styles.overlay}>
      <div
        className={styles.colorPickerContainer}
        onClick={e => e.stopPropagation()}
      >
        <Circle
          colors={[
            '#f44336',
            '#673ab7',
            '#3f51b5',
            '#03a9f4',
            '#009688',
            '#4caf50',
            '#cddc39',
            '#ff9800',
            '#ff5722',
            '#795548',
            '#607d8b',
          ]}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(11, auto)',
            gap: '0.375rem',
            alignItems: 'center',
            justifyItems: 'start',
          }}
          color={color}
          onChange={color => setColor(color.hex)}
          className={styles.colorPicker}
        />
      </div>
    </div>
  );
}
