/**
 * Generate balanced teams based on player levels
 * Uses a snake draft algorithm for efficient and fair team distribution
 * 
 * @param players Array of player objects with level property
 * @param numTeams Number of teams to generate
 * @returns Array of teams, where each team is an array of player objects
 */
export function generateTeams(players: any[], numTeams: number) {
  // Validate inputs
  if (!players || players.length === 0 || numTeams <= 0) {
    return [];
  }

  // Handle single team case
  if (numTeams === 1) {
    return [players];
  }

  // Sort players by level in descending order
  const sortedPlayers = [...players].sort((a, b) => b.level - a.level);
  
  // Initialize teams array
  const teams = Array.from({ length: numTeams }, () => []);
  
  // Calculate total skill level
  const totalSkill = sortedPlayers.reduce((sum, player) => sum + player.level, 0);
  const targetSkillPerTeam = totalSkill / numTeams;
  
  // Distribute players using snake draft pattern
  let currentTeam = 0;
  let direction = 1; // 1 for forward, -1 for backward
  
  for (const player of sortedPlayers) {
    teams[currentTeam].push(player);
    
    // Move to next team
    currentTeam += direction;
    
    // Change direction if we hit the ends
    if (currentTeam >= numTeams - 1) {
      direction = -1;
      currentTeam = numTeams - 1; // Ensure we don't go out of bounds
    } else if (currentTeam <= 0) {
      direction = 1;
      currentTeam = 0; // Ensure we don't go out of bounds
    }
  }
  
  // Balance teams by swapping players if necessary
  let iterations = 0;
  const maxIterations = 100; // Prevent infinite loops
  
  while (iterations < maxIterations) {
    let improved = false;
    
    for (let i = 0; i < teams.length; i++) {
      for (let j = i + 1; j < teams.length; j++) {
        const team1Skill = teams[i].reduce((sum, p) => sum + p.level, 0);
        const team2Skill = teams[j].reduce((sum, p) => sum + p.level, 0);
        
        const diff = Math.abs(team1Skill - team2Skill);
        
        // Try to swap players to improve balance
        for (let p1 = 0; p1 < teams[i].length; p1++) {
          for (let p2 = 0; p2 < teams[j].length; p2++) {
            const newTeam1Skill = team1Skill - teams[i][p1].level + teams[j][p2].level;
            const newTeam2Skill = team2Skill - teams[j][p2].level + teams[i][p1].level;
            const newDiff = Math.abs(newTeam1Skill - newTeam2Skill);
            
            if (newDiff < diff) {
              // Swap players
              const temp = teams[i][p1];
              teams[i][p1] = teams[j][p2];
              teams[j][p2] = temp;
              improved = true;
              break;
            }
          }
          if (improved) break;
        }
      }
    }
    
    if (!improved) break;
    iterations++;
  }
  
  return teams;
}