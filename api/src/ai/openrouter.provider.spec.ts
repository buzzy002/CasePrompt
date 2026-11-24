import { OpenRouterProvider } from './openrouter.provider.js';

// fetch is stubbed: these tests never call OpenRouter.
describe('OpenRouterProvider', () => {
  const provider = new OpenRouterProvider({
    apiKey: 'test-key',
    model: 'test/model',
    timeoutMs: 1000,
  });
  const prompt = {
    system: 'Tu es le maître du jeu.',
    player: '<player>Je regarde</player>',
  };

  function openRouterReply(content: string, status = 200) {
    return new Response(
      JSON.stringify({ choices: [{ message: { content } }] }),
      { status },
    );
  }

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('sends the model, both messages, the JSON schema and the provider rules', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(
        openRouterReply(
          '{"action":null,"new_condition":null,"removed_condition":null,"narration":"Rien ne bouge."}',
        ),
      );
    vi.stubGlobal('fetch', fetchMock);

    await provider.playTurn(prompt);

    const [url, init] = fetchMock.mock.calls[0];
    const body = JSON.parse(init.body);
    expect(url).toBe('https://openrouter.ai/api/v1/chat/completions');
    expect(init.headers.Authorization).toBe('Bearer test-key');
    expect(body.model).toBe('test/model');
    expect(body.messages).toEqual([
      { role: 'system', content: prompt.system },
      { role: 'user', content: prompt.player },
    ]);
    expect(body.response_format.type).toBe('json_schema');
    expect(body.provider).toEqual({
      require_parameters: true,
      data_collection: 'deny',
    });
  });

  it('returns the checked answer of the model', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValue(
          openRouterReply(
            '{"action":null,"new_condition":"cheville foulée","removed_condition":null,"narration":"Tu glisses."}',
          ),
        ),
    );

    const answer = await provider.playTurn(prompt);

    expect(answer).toEqual({
      action: null,
      new_condition: 'cheville foulée',
      removed_condition: null,
      narration: 'Tu glisses.',
    });
  });

  it('tolerates a ```json fence around the answer', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValue(
          openRouterReply(
            '```json\n{"action":null,"new_condition":null,"removed_condition":null,"narration":"Ok."}\n```',
          ),
        ),
    );

    const answer = await provider.playTurn(prompt);

    expect(answer.narration).toBe('Ok.');
  });

  it('rejects an answer that is not JSON', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(openRouterReply('Bonjour !')),
    );

    await expect(provider.playTurn(prompt)).rejects.toThrow('inutilisable');
  });

  it('rejects an answer with an empty narration', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValue(
          openRouterReply(
            '{"action":null,"new_condition":null,"removed_condition":null,"narration":"  "}',
          ),
        ),
    );

    await expect(provider.playTurn(prompt)).rejects.toThrow('inutilisable');
  });

  it('fails on an HTTP error, such as exhausted credit', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValue(
          new Response('Insufficient credits', { status: 402 }),
        ),
    );

    await expect(provider.playTurn(prompt)).rejects.toThrow('402');
  });
});
