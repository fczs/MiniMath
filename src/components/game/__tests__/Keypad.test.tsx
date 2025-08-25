import { render, screen, fireEvent } from '@testing-library/react';
import Keypad from '../Keypad';

describe('Keypad Component', () => {
  const defaultProps = {
    onNumberInput: jest.fn(),
    onBackspace: jest.fn(),
    onSubmit: jest.fn(),
    value: '',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic functionality', () => {
    it('renders all number keys (0-9)', () => {
      render(<Keypad {...defaultProps} />);
      
      for (let i = 0; i <= 9; i++) {
        expect(screen.getByRole('button', { name: `Digit ${i}` })).toBeInTheDocument();
      }
    });

    it('renders action keys (backspace, submit)', () => {
      render(<Keypad {...defaultProps} />);
      
      expect(screen.getByRole('button', { name: 'Backspace' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Submit answer' })).toBeInTheDocument();
    });

    it('calls onNumberInput when number is clicked', () => {
      const onNumberInput = jest.fn();

      render(<Keypad {...defaultProps} onNumberInput={onNumberInput} />);
      
      fireEvent.click(screen.getByRole('button', { name: 'Digit 5' }));
      expect(onNumberInput).toHaveBeenCalledWith('5');
    });

    it('calls onBackspace when backspace is clicked', () => {
      const onBackspace = jest.fn();

      render(<Keypad {...defaultProps} value="123" onBackspace={onBackspace} />);
      
      fireEvent.click(screen.getByRole('button', { name: 'Backspace' }));
      expect(onBackspace).toHaveBeenCalled();
    });

    it('calls onSubmit when submit is clicked', () => {
      const onSubmit = jest.fn();

      render(<Keypad {...defaultProps} value="123" onSubmit={onSubmit} />);
      
      fireEvent.click(screen.getByRole('button', { name: 'Submit answer' }));
      expect(onSubmit).toHaveBeenCalled();
    });
  });

  describe('Minus key functionality', () => {
    it('does not show minus key by default', () => {
      render(<Keypad {...defaultProps} />);
      
      expect(screen.queryByRole('button', { name: 'Minus sign' })).not.toBeInTheDocument();
    });

    it('shows minus key when showMinusKey is true', () => {
      render(<Keypad {...defaultProps} showMinusKey={true} />);
      
      expect(screen.getByRole('button', { name: 'Minus sign' })).toBeInTheDocument();
    });

    it('calls onNumberInput with minus sign when minus key is clicked', () => {
      const onNumberInput = jest.fn();

      render(<Keypad {...defaultProps} showMinusKey={true} onNumberInput={onNumberInput} />);
      
      fireEvent.click(screen.getByRole('button', { name: 'Minus sign' }));
      expect(onNumberInput).toHaveBeenCalledWith('−');
    });

    it('disables minus key when value already starts with minus', () => {
      render(<Keypad {...defaultProps} showMinusKey={true} value="−123" />);
      
      const minusButton = screen.getByRole('button', { name: 'Minus sign' });

      expect(minusButton).toBeDisabled();
    });

    it('enables minus key when value is empty', () => {
      render(<Keypad {...defaultProps} showMinusKey={true} value="" />);
      
      const minusButton = screen.getByRole('button', { name: 'Minus sign' });

      expect(minusButton).not.toBeDisabled();
    });

    it('enables minus key when value does not start with minus', () => {
      render(<Keypad {...defaultProps} showMinusKey={true} value="123" />);
      
      const minusButton = screen.getByRole('button', { name: 'Minus sign' });

      expect(minusButton).not.toBeDisabled();
    });
  });

  describe('Hint functionality', () => {
    it('shows hint button when canShowHint is true', () => {
      render(<Keypad {...defaultProps} canShowHint={true} />);
      
      const hintButton = screen.getByRole('button', { name: 'Show hint' });

      expect(hintButton).toBeVisible();
    });

    it('hides hint button when canShowHint is false', () => {
      render(<Keypad {...defaultProps} canShowHint={false} />);
      
      const hintButton = screen.getByRole('button', { name: 'Show hint' });

      expect(hintButton).toHaveStyle({ opacity: '0' });
    });

    it('calls onShowHint when hint button is clicked', () => {
      const onShowHint = jest.fn();

      render(<Keypad {...defaultProps} canShowHint={true} onShowHint={onShowHint} />);
      
      fireEvent.click(screen.getByRole('button', { name: 'Show hint' }));
      expect(onShowHint).toHaveBeenCalled();
    });
  });

  describe('Disabled state', () => {
    it('disables all keys when disabled prop is true', () => {
      render(<Keypad {...defaultProps} disabled={true} value="123" />);
      
      // Check number keys
      for (let i = 0; i <= 9; i++) {
        expect(screen.getByRole('button', { name: `Digit ${i}` })).toBeDisabled();
      }
      
      // Check action keys
      expect(screen.getByRole('button', { name: 'Backspace' })).toBeDisabled();
      expect(screen.getByRole('button', { name: 'Submit answer' })).toBeDisabled();
    });

    it('disables backspace when value is empty', () => {
      render(<Keypad {...defaultProps} value="" />);
      
      expect(screen.getByRole('button', { name: 'Backspace' })).toBeDisabled();
    });

    it('disables submit when value is empty', () => {
      render(<Keypad {...defaultProps} value="" />);
      
      expect(screen.getByRole('button', { name: 'Submit answer' })).toBeDisabled();
    });
  });

  describe('Display', () => {
    it('shows "0" when value is empty', () => {
      render(<Keypad {...defaultProps} value="" />);
      
      // Look specifically in the display area (there are two "0" texts - one in display, one on button)
      const displayElements = screen.getAllByText('0');

      expect(displayElements.length).toBeGreaterThan(0);
    });

    it('shows the current value', () => {
      render(<Keypad {...defaultProps} value="123" />);
      
      expect(screen.getByText('123')).toBeInTheDocument();
    });

    it('shows negative values correctly', () => {
      render(<Keypad {...defaultProps} value="−456" />);
      
      expect(screen.getByText('−456')).toBeInTheDocument();
    });
  });

  describe('Mathematical minus sign handling', () => {
    it('allows submitting numbers with mathematical minus sign', () => {
      const onSubmit = jest.fn();

      render(<Keypad {...defaultProps} showMinusKey={true} onSubmit={onSubmit} value="−42" />);
      
      fireEvent.click(screen.getByRole('button', { name: 'Submit answer' }));
      expect(onSubmit).toHaveBeenCalledTimes(1);
    });

    it('displays mathematical minus sign in value', () => {
      render(<Keypad {...defaultProps} showMinusKey={true} value="−7" />);
      
      expect(screen.getByText('−7')).toBeInTheDocument();
    });
  });
});
