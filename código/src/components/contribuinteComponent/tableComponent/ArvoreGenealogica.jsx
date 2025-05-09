// ArvoreGenealogica.jsx
import React, { useEffect, useState } from "react";
import ReactFlow, { Background, Controls, MarkerType } from "reactflow";
import "reactflow/dist/style.css";
import filiacaoService from "../../../service/contribuinte/filiacaoService";

// Cores adaptadas da paleta do gov.br
const RELATIONSHIP_COLORS = {
  "mãe": "#EAF3FA",       // azul clarinho
  "pai": "#EAF3FA",       // azul clarinho
  "avô": "#FEF7E0",       // amarelo claro
  "avó": "#FEF7E0",       // amarelo claro
  "filho": "#E5F7EE",     // verde claro
  "filha": "#E5F7EE",     // verde claro
  "tio": "#F3F3F3",       // neutro claro
  "tia": "#F3F3F3"        // neutro claro
};

const BORDER_COLORS = {
  "mãe": "#003366",       // azul gov.br
  "pai": "#003366",
  "avô": "#EABE3F",       // amarelo gov.br
  "avó": "#EABE3F",
  "filho": "#1B4B3F",     // verde escuro
  "filha": "#1B4B3F",
  "tio": "#666666",       // cinza escuro
  "tia": "#666666"
};

export default function ArvoreGenealogica({ cpf, exibir, nomeContribuinte }) {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (exibir && cpf && nomeContribuinte) {
      setCarregando(true);
      setErro("");

      filiacaoService
        .gerarArvore(cpf)
        .then((res) => {
          const familyData = res.data;
          const newNodes = [];
          const newEdges = [];

          newNodes.push({
            id: "main",
            data: { 
              label: (
                <div>
                  <div style={{ fontWeight: "bold" }}>{nomeContribuinte}</div>
                  <div>Contribuinte</div>
                </div>
              )
            },
            position: { x: 500, y: 400 },
            style: {
              backgroundColor: "#CCE4F6", // azul gov.br
              border: "2px solid #003366",
              width: "180px",
              padding: "10px",
              borderRadius: "8px",
              textAlign: "center",
            }
          });

          const parents = familyData.filter(r => 
            r.descricaoParentesco.toLowerCase().includes("mãe") || 
            r.descricaoParentesco.toLowerCase().includes("pai")
          );
          
          let rightmostParentX = 500;
          parents.forEach((parent, i) => {
            const relType = parent.descricaoParentesco.toLowerCase().includes("mãe") ? "mãe" : "pai";
            const nodeId = `parent-${i}`;
            const xPos = 500 + ((i - (parents.length - 1) / 2) * 180);
            rightmostParentX = Math.max(rightmostParentX, xPos);

            newNodes.push({
              id: nodeId,
              data: { 
                label: (
                  <div>
                    <div style={{ fontWeight: "bold" }}>{parent.nomeParente}</div>
                    <div>{parent.descricaoParentesco}</div>
                  </div>
                )
              },
              position: { x: xPos, y: 250 },
              style: {
                backgroundColor: RELATIONSHIP_COLORS[relType],
                border: `2px solid ${BORDER_COLORS[relType]}`,
                width: "180px",
                padding: "10px",
                borderRadius: "8px",
                textAlign: "center",
              }
            });

            newEdges.push({
              id: `edge-${nodeId}-main`,
              source: nodeId,
              target: "main",
              markerEnd: { type: MarkerType.ArrowClosed },
              style: { strokeWidth: 2 }
            });
          });

          const grandparents = familyData.filter(r => 
            r.descricaoParentesco.toLowerCase().includes("avô") || 
            r.descricaoParentesco.toLowerCase().includes("avó")
          );
          const grandparentY = parents.length > 0 ? 100 : 250;
          grandparents.forEach((grandparent, i) => {
            const relType = grandparent.descricaoParentesco.toLowerCase().includes("avó") ? "avó" : "avô";
            const nodeId = `grandparent-${i}`;
            const xPos = 500 + ((i - (grandparents.length - 1) / 2) * 180);

            newNodes.push({
              id: nodeId,
              data: {
                label: (
                  <div>
                    <div style={{ fontWeight: "bold" }}>{grandparent.nomeParente}</div>
                    <div>{grandparent.descricaoParentesco}</div>
                  </div>
                )
              },
              position: { x: xPos, y: grandparentY },
              style: {
                backgroundColor: RELATIONSHIP_COLORS[relType],
                border: `2px solid ${BORDER_COLORS[relType]}`,
                width: "180px",
                padding: "10px",
                borderRadius: "8px",
                textAlign: "center",
              }
            });

            newEdges.push({
              id: `edge-${nodeId}-main`,
              source: nodeId,
              target: "main",
              markerEnd: { type: MarkerType.ArrowClosed },
              style: { strokeWidth: 2 }
            });
          });

          const unclesAunts = familyData.filter(r => 
            r.descricaoParentesco.toLowerCase().includes("tio") || 
            r.descricaoParentesco.toLowerCase().includes("tia")
          );
          const tioBaseX = rightmostParentX + 200;
          const tioY = parents.length > 0 || grandparents.length > 0 ? 250 : 250;

          unclesAunts.forEach((relative, i) => {
            const relType = relative.descricaoParentesco.toLowerCase().includes("tia") ? "tia" : "tio";
            const nodeId = `uncle-aunt-${i}`;
            const xPos = tioBaseX;
            const yPos = tioY + (i * 80);

            newNodes.push({
              id: nodeId,
              data: {
                label: (
                  <div>
                    <div style={{ fontWeight: "bold" }}>{relative.nomeParente}</div>
                    <div>{relative.descricaoParentesco}</div>
                  </div>
                )
              },
              position: { x: xPos, y: yPos },
              style: {
                backgroundColor: RELATIONSHIP_COLORS[relType],
                border: `2px solid ${BORDER_COLORS[relType]}`,
                width: "180px",
                padding: "10px",
                borderRadius: "8px",
                textAlign: "center",
              }
            });

            newEdges.push({
              id: `edge-${nodeId}-main`,
              source: nodeId,
              target: "main",
              markerEnd: { type: MarkerType.ArrowClosed },
              style: { strokeWidth: 2, strokeDasharray: "5,5" }
            });
          });

          const children = familyData.filter(r => 
            r.descricaoParentesco.toLowerCase().includes("filho") || 
            r.descricaoParentesco.toLowerCase().includes("filha")
          );
          children.forEach((child, i) => {
            const relType = child.descricaoParentesco.toLowerCase().includes("filha") ? "filha" : "filho";
            const nodeId = `child-${i}`;
            const xPos = 500 + ((i - (children.length - 1) / 2) * 180);

            newNodes.push({
              id: nodeId,
              data: {
                label: (
                  <div>
                    <div style={{ fontWeight: "bold" }}>{child.nomeParente}</div>
                    <div>{child.descricaoParentesco}</div>
                  </div>
                )
              },
              position: { x: xPos, y: 550 },
              style: {
                backgroundColor: RELATIONSHIP_COLORS[relType],
                border: `2px solid ${BORDER_COLORS[relType]}`,
                width: "180px",
                padding: "10px",
                borderRadius: "8px",
                textAlign: "center",
              }
            });

            newEdges.push({
              id: `edge-main-${nodeId}`,
              source: "main",
              target: nodeId,
              markerEnd: { type: MarkerType.ArrowClosed },
              style: { strokeWidth: 2 }
            });
          });

          setNodes(newNodes);
          setEdges(newEdges);
        })
        .catch((err) => {
          console.error("Erro ao buscar árvore genealógica:", err);
          setErro("Erro ao buscar dados da árvore genealógica.");
        })
        .finally(() => setCarregando(false));
    }
  }, [exibir, cpf, nomeContribuinte]);

  return (
    <div style={{ width: "100%", height: "600px" }}>
      {carregando ? (
        <div>Carregando árvore genealógica...</div>
      ) : erro ? (
        <div style={{ color: "red" }}>{erro}</div>
      ) : (
        <ReactFlow
          nodes={nodes}
          edges={edges}
          fitView
        >
          <Background />
          <Controls />
        </ReactFlow>
      )}
    </div>
  );
}
