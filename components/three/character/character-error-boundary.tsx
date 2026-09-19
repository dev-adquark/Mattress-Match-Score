import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class CharacterErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: { componentStack?: string | null }): void {
    // The sleeping character is a non-essential decorative element, so a
    // failure here degrades gracefully (render nothing) rather than crashing
    // the page. But failing with zero diagnostics made a real, silent
    // rendering failure undiagnosable — always log so it shows up in the
    // console during development and in error-tracking in production.
    console.error('[SleepingCharacter] failed to render, degrading gracefully:', error, info.componentStack);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return null;
    }
    return this.props.children;
  }
}
