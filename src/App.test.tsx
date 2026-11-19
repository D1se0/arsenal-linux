import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import App from './App';

beforeEach(() => {
  document.documentElement.dataset.theme = 'dark';
  window.history.replaceState({}, '', '/');
});

describe('Arsenal Linux', () => {
  it('renderiza el hero, las estadísticas y el explorador', () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/el arsenal de comandos de linux/i);
    expect(screen.getByText(/base de datos abierta/i)).toBeInTheDocument();
    expect(screen.getByRole('searchbox', { name: /buscar comandos/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /toda la terminal/i })).toBeInTheDocument();
  });

  it('busca, abre un dossier y navega por sus parámetros', async () => {
    const user = userEvent.setup();
    render(<App />);

    const search = screen.getByRole('searchbox', { name: /buscar comandos/i });
    await user.type(search, 'nmap');

    const openButton = await screen.findByRole('button', { name: /abrir ficha de nmap/i });
    await user.click(openButton);

    const dialog = await screen.findByRole('dialog');
    expect(within(dialog).getByRole('heading', { name: /^nmap$/i })).toBeInTheDocument();
    expect(within(dialog).getByText(/el estándar para descubrir hosts/i)).toBeInTheDocument();

    await user.click(within(dialog).getByRole('button', { name: /parámetros/i }));
    expect(within(dialog).getAllByText('-sS').length).toBeGreaterThan(0);
    expect(within(dialog).getByText(/escaneo syn semiautomático/i)).toBeInTheDocument();

    await user.click(within(dialog).getByRole('button', { name: /ejemplos/i }));
    expect(within(dialog).getByText(/descubrir hosts vivos/i)).toBeInTheDocument();

    await user.click(within(dialog).getByRole('button', { name: /cerrar ficha/i }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('abre la paleta con Ctrl+K y busca comandos', async () => {
    const user = userEvent.setup();
    render(<App />);

    fireEvent.keyDown(window, { key: 'k', ctrlKey: true });
    const palette = await screen.findByRole('dialog', { name: /búsqueda rápida/i });
    const input = within(palette).getByRole('textbox', { name: /buscar comandos/i });
    await user.type(input, 'tcpdump');

    const option = await within(palette).findByRole('option', { name: /tcpdump/i });
    await user.click(option);

    const dossier = await screen.findByRole('dialog');
    expect(within(dossier).getByRole('heading', { name: /^tcpdump$/i })).toBeInTheDocument();
  });

  it('muestra estado vacío y permite limpiar los filtros', async () => {
    const user = userEvent.setup();
    render(<App />);

    const search = screen.getByRole('searchbox', { name: /buscar comandos/i });
    await user.type(search, 'xyz-no-existe');

    expect(await screen.findByText(/sin resultados con estos filtros/i)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /limpiar búsqueda y filtros/i }));
    expect(screen.queryByText(/sin resultados con estos filtros/i)).not.toBeInTheDocument();
    expect(search).toHaveValue('');
  });

  it('alterna entre tema oscuro y claro', async () => {
    const user = userEvent.setup();
    render(<App />);

    const toggle = screen.getByRole('button', { name: /activar tema claro/i });
    await user.click(toggle);
    expect(document.documentElement.dataset.theme).toBe('light');
    expect(screen.getByRole('button', { name: /activar tema oscuro/i })).toBeInTheDocument();
  });
});
