import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Builder } from './Builder';

describe('Command builder', () => {
  it('compone el comando por defecto de nmap', () => {
    render(<Builder onOpenCommand={() => {}} />);
    expect(screen.getByTestId('builder-command')).toHaveTextContent('nmap -sS -sV -sC 10.10.10.5');
  });

  it('activa y desactiva flags, y añade valores', async () => {
    const user = userEvent.setup();
    render(<Builder onOpenCommand={() => {}} />);

    const allPorts = screen.getByRole('button', { name: /-p-.*todos los puertos/i });
    await user.click(allPorts);
    expect(screen.getByTestId('builder-command')).toHaveTextContent('-p-');

    const scripts = screen.getByRole('button', { name: /--script.*scripts nse/i });
    await user.click(scripts);
    const value = screen.getByRole('textbox', { name: /valor para --script/i });
    await user.clear(value);
    await user.type(value, 'vuln and safe');
    expect(screen.getByTestId('builder-command')).toHaveTextContent('--script vuln and safe');
  });

  it('cambia de herramienta y restablece sus valores', async () => {
    const user = userEvent.setup();
    render(<Builder onOpenCommand={() => {}} />);

    await user.click(screen.getByRole('tab', { name: /tcpdump/i }));
    expect(screen.getByTestId('builder-command')).toHaveTextContent('tcpdump -i eth0 -nn -s0 port 443');

    await user.click(screen.getByRole('tab', { name: /find/i }));
    expect(screen.getByTestId('builder-command')).toHaveTextContent('find /var/www -type f -xdev');

    const nameFlag = screen.getByRole('button', { name: /-name.*nombre/i });
    await user.click(nameFlag);
    expect(screen.getByTestId('builder-command')).toHaveTextContent('-name *.php');
  });
});
