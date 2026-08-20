import { render, screen, fireEvent, within } from '@testing-library/react';
import PublishMachine from './PublishMachine';
import Fork from './Fork';
import { CATALOGUE, CATALOGUE_TOTAL, CATALOGUE_COUNT } from '../data/catalogue';

/* These cover the two pieces of the about page that respond to the reader
   rather than to the scrollbar, so a regression shows up as a failing test
   and not as a button that quietly does nothing. */

describe('PublishMachine', () => {
  test('starts empty and invites a press', () => {
    render(<PublishMachine />);
    expect(screen.getByText(/nothing published yet/i)).toBeInTheDocument();
    expect(screen.getByText(/each press publishes one of my real videos/i)).toBeInTheDocument();
    expect(screen.getByText(`${CATALOGUE_COUNT} left`)).toBeInTheDocument();
  });

  test('each press deals one real view count and updates the totals', () => {
    render(<PublishMachine />);
    const publish = screen.getByRole('button', { name: /publish one/i });

    fireEvent.click(publish);
    expect(screen.getByText(`${CATALOGUE_COUNT - 1} left`)).toBeInTheDocument();

    const published = screen.getByText('published').closest('div');
    expect(within(published).getByText('1')).toBeInTheDocument();

    fireEvent.click(publish);
    fireEvent.click(publish);
    expect(screen.getByText(`${CATALOGUE_COUNT - 3} left`)).toBeInTheDocument();
    expect(within(screen.getByText('published').closest('div')).getByText('3')).toBeInTheDocument();
  });

  test('draws without replacement and ends on the real catalogue total', () => {
    render(<PublishMachine />);
    const publish = screen.getByRole('button', { name: /publish one/i });
    for (let i = 0; i < CATALOGUE_COUNT; i += 1) fireEvent.click(publish);

    expect(screen.getByText('0 left')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /that is the whole channel/i })
    ).toBeDisabled();

    /* Every card dealt exactly once means the totals must match the source. */
    const totals = screen.getByText('total views').closest('div');
    expect(within(totals).getByText(CATALOGUE_TOTAL.toLocaleString())).toBeInTheDocument();
    /* The live commentary, which names the video that carries the channel. */
    expect(screen.getByText(/is one upload: "asymmetric risk in jjk terms"/i))
      .toBeInTheDocument();
  });

  test('start over refills the deck', () => {
    render(<PublishMachine />);
    fireEvent.click(screen.getByRole('button', { name: /publish one/i }));
    fireEvent.click(screen.getByRole('button', { name: /start over/i }));
    expect(screen.getByText(`${CATALOGUE_COUNT} left`)).toBeInTheDocument();
    expect(screen.getByText(/nothing published yet/i)).toBeInTheDocument();
  });
});

describe('Fork', () => {
  test('withholds the answer until the reader chooses', () => {
    render(<Fork />);
    expect(screen.getByText(/do you keep going\?/i)).toBeInTheDocument();
    expect(screen.queryByText(/that is what i did/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/completely reasonable/i)).not.toBeInTheDocument();
  });

  /* AnimatePresence mode="wait" holds the outgoing answer until its exit
     finishes, so switching answers has to be awaited rather than asserted
     on the next tick. */
  test('each choice gets its own honest answer', async () => {
    render(<Fork />);
    fireEvent.click(screen.getByRole('button', { name: /keep going/i }));
    expect(await screen.findByText(/that is what i did/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /stop, it is not working/i }));
    expect(await screen.findByText(/completely reasonable/i)).toBeInTheDocument();
  });
});
