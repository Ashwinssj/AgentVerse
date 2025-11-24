def generate_session_report(session):
    """
    Generates a markdown report for a given session.
    """
    if not session.turns.exists():
        return "No conversation to analyze."
    
    # Calculate statistics
    total_turns = session.turns.count()
    agents_stats = {}
    
    for agent in session.agents.all():
        agent_turns = session.turns.filter(agent=agent)
        agents_stats[agent.name] = {
            'turns': agent_turns.count(),
            'avg_length': sum(len(t.response) for t in agent_turns) / agent_turns.count() if agent_turns.exists() else 0
        }
    
    # Build report
    report = f"# Session Analysis Report\n\n"
    report += f"**Session ID:** {session.id}\n\n"
    report += f"**Topic:** {session.topic}\n\n"
    report += f"**Status:** {session.status}\n\n"
    report += f"**Total Turns:** {total_turns} / {session.max_turns}\n\n"
    
    report += f"## Agent Participation\n\n"
    for agent_name, stats in agents_stats.items():
        report += f"### {agent_name}\n"
        report += f"- Turns: {stats['turns']}\n"
        report += f"- Average Response Length: {int(stats['avg_length'])} characters\n\n"
    
    report += f"## Timeline\n\n"
    report += f"- Started: {session.created_at.strftime('%Y-%m-%d %H:%M:%S')}\n"
    report += f"- Last Activity: {session.turns.last().created_at.strftime('%Y-%m-%d %H:%M:%S') if session.turns.exists() else 'N/A'}\n\n"
    
    return report
