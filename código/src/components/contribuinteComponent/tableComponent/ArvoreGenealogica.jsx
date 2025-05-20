// ArvoreGenealogica.jsx
import React, { useEffect, useState } from "react";
import ReactFlow, { Background, Controls, MarkerType } from "reactflow";
import "reactflow/dist/style.css";
import filiacaoService from "../../../service/contribuinte/filiacaoService";

const RELATIONSHIP_COLORS = {
  "mãe": "#EAF3FA",
  "pai": "#EAF3FA",
  "avô": "#FEF7E0",
  "avó": "#FEF7E0",
  "filho": "#E5F7EE",
  "filha": "#E5F7EE",
  "tio": "#F3F3F3",
  "tia": "#F3F3F3"
};

const BORDER_COLORS = {
  "mãe": "#003366",
  "pai": "#003366",
  "avô": "#EABE3F",
  "avó": "#EABE3F",
  "filho": "#1B4B3F",
  "filha": "#1B4B3F",
  "tio": "#666666",
  "tia": "#666666"
};

export default function ArvoreGenealogica({ cpf, exibir, nomeContribuinte }) {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  useEffect(() => {
    if (!exibir || !cpf || !nomeContribuinte) return;

    filiacaoService.gerarArvore(cpf).then((res) => {
      const data = res.data;
      const nodeMap = {};
      const edgeList = [];
      let nodeIdCounter = 0;

      const createNode = (name, rel, x, y) => {
        const tipo = rel.toLowerCase().includes("tia") ? "tia" :
                     rel.toLowerCase().includes("tio") ? "tio" :
                     rel.toLowerCase().includes("avó") ? "avó" :
                     rel.toLowerCase().includes("avô") ? "avô" :
                     rel.toLowerCase().includes("mãe") ? "mãe" :
                     rel.toLowerCase().includes("pai") ? "pai" :
                     rel.toLowerCase().includes("filha") ? "filha" :
                     rel.toLowerCase().includes("filho") ? "filho" : "desconhecido";

        const id = `node-${nodeIdCounter++}`;
        nodeMap[rel + name] = id;
        return {
          id,
          data: {
            label: (
              <div>
                <div style={{ fontWeight: "bold" }}>{name}</div>
                <div>{rel}</div>
              </div>
            )
          },
          position: { x, y },
          style: {
            backgroundColor: RELATIONSHIP_COLORS[tipo] || "#fff",
            border: `2px solid ${BORDER_COLORS[tipo] || "#000"}`,
            width: "180px",
            padding: "10px",
            borderRadius: "8px",
            textAlign: "center",
          }
        };
      };

      const nodes = [];
      const centerX = 600;
      const centerY = 400;
      const nodeSpacingY = 150;
      const nodeSpacingX = 220;

      const mainNode = createNode(nomeContribuinte, "Contribuinte", centerX, centerY);
      nodes.push(mainNode);

      const getRelatives = (desc) => data.filter(r => r.descricaoParentesco === desc);

      // Pai e Mãe
      const pai = getRelatives("Pai")[0];
      const mae = getRelatives("Mãe")[0];
      const paiNode = pai && createNode(pai.nomeParente, "Pai", centerX + nodeSpacingX, centerY - nodeSpacingY);
      const maeNode = mae && createNode(mae.nomeParente, "Mãe", centerX - nodeSpacingX, centerY - nodeSpacingY);
      
      if (paiNode) {
        nodes.push(paiNode);
        edgeList.push({ id: `edge-pai`, source: paiNode.id, target: mainNode.id, markerEnd: { type: MarkerType.ArrowClosed }, style: { strokeWidth: 2 } });
      }
      if (maeNode) {
        nodes.push(maeNode);
        edgeList.push({ id: `edge-mae`, source: maeNode.id, target: mainNode.id, markerEnd: { type: MarkerType.ArrowClosed }, style: { strokeWidth: 2 } });
      }

      // Tios Paternos (conectados ao pai se existir, ou ao contribuinte se não existir pai)
      const tiosPaternos = data.filter(r => r.descricaoParentesco === "Tio Paterno" || r.descricaoParentesco === "Tia Paterna");
      tiosPaternos.forEach((tio, idx) => {
        const targetNodeId = paiNode ? paiNode.id : mainNode.id;
        const tioNode = createNode(
          tio.nomeParente, 
          tio.descricaoParentesco, 
          (paiNode ? paiNode.position.x : centerX) + ((idx + 1) * nodeSpacingX), 
          (paiNode ? paiNode.position.y : centerY - nodeSpacingY)
        );
        nodes.push(tioNode);
        edgeList.push({ 
          id: `edge-tioP-${idx}`, 
          source: tioNode.id, 
          target: targetNodeId, 
          markerEnd: { type: MarkerType.ArrowClosed }, 
          style: { strokeDasharray: paiNode ? "5,5" : "1,0", strokeWidth: 2 } 
        });
      });

      // Tios Maternos (conectados à mãe se existir, ou ao contribuinte se não existir mãe)
      const tiosMaternos = data.filter(r => r.descricaoParentesco === "Tio Materno" || r.descricaoParentesco === "Tia Materna");
      tiosMaternos.forEach((tio, idx) => {
        const targetNodeId = maeNode ? maeNode.id : mainNode.id;
        const tioNode = createNode(
          tio.nomeParente, 
          tio.descricaoParentesco, 
          (maeNode ? maeNode.position.x : centerX) - ((idx + 1) * nodeSpacingX), 
          (maeNode ? maeNode.position.y : centerY - nodeSpacingY)
        );
        nodes.push(tioNode);
        edgeList.push({ 
          id: `edge-tioM-${idx}`, 
          source: tioNode.id, 
          target: targetNodeId, 
          markerEnd: { type: MarkerType.ArrowClosed }, 
          style: { strokeDasharray: maeNode ? "5,5" : "1,0", strokeWidth: 2 } 
        });
      });

      // Avós Paternos (conectados ao pai se existir, ou aos tios paternos/contribuinte se não existir pai)
      const avoPaterno = getRelatives("Avô Paterno")[0];
      const avoaPaterna = getRelatives("Avó Paterna")[0];
      
      if (avoPaterno || avoaPaterna) {
        const avoPaternoNode = avoPaterno && createNode(
          avoPaterno.nomeParente, 
          "Avô Paterno", 
          (paiNode ? paiNode.position.x : centerX + nodeSpacingX) + nodeSpacingX/2, 
          (paiNode ? paiNode.position.y : centerY - nodeSpacingY) - nodeSpacingY
        );
        
        const avoaPaternaNode = avoaPaterna && createNode(
          avoaPaterna.nomeParente, 
          "Avó Paterna", 
          (paiNode ? paiNode.position.x : centerX + nodeSpacingX) - nodeSpacingX/2, 
          (paiNode ? paiNode.position.y : centerY - nodeSpacingY) - nodeSpacingY
        );

        if (avoPaternoNode) {
          nodes.push(avoPaternoNode);
          if (paiNode) {
            edgeList.push({ id: `edge-avop`, source: avoPaternoNode.id, target: paiNode.id, markerEnd: { type: MarkerType.ArrowClosed }, style: { strokeWidth: 2 } });
          } else {
            // Conecta aos tios paternos ou ao contribuinte
            const hasTiosPaternos = tiosPaternos.length > 0;
            if (hasTiosPaternos) {
              tiosPaternos.forEach((tio, idx) => {
                const tioNodeId = nodeMap[tio.descricaoParentesco + tio.nomeParente];
                if (tioNodeId) {
                  edgeList.push({ id: `edge-avop-tio-${idx}`, source: avoPaternoNode.id, target: tioNodeId, markerEnd: { type: MarkerType.ArrowClosed }, style: { strokeWidth: 2 } });
                }
              });
            } else {
              edgeList.push({ id: `edge-avop-contrib`, source: avoPaternoNode.id, target: mainNode.id, markerEnd: { type: MarkerType.ArrowClosed }, style: { strokeWidth: 2, strokeDasharray: "5,5" } });
            }
          }
        }

        if (avoaPaternaNode) {
          nodes.push(avoaPaternaNode);
          if (paiNode) {
            edgeList.push({ id: `edge-avoap`, source: avoaPaternaNode.id, target: paiNode.id, markerEnd: { type: MarkerType.ArrowClosed }, style: { strokeWidth: 2 } });
          } else {
            // Conecta aos tios paternos ou ao contribuinte
            const hasTiosPaternos = tiosPaternos.length > 0;
            if (hasTiosPaternos) {
              tiosPaternos.forEach((tio, idx) => {
                const tioNodeId = nodeMap[tio.descricaoParentesco + tio.nomeParente];
                if (tioNodeId) {
                  edgeList.push({ id: `edge-avoap-tio-${idx}`, source: avoaPaternaNode.id, target: tioNodeId, markerEnd: { type: MarkerType.ArrowClosed }, style: { strokeWidth: 2 } });
                }
              });
            } else {
              edgeList.push({ id: `edge-avoap-contrib`, source: avoaPaternaNode.id, target: mainNode.id, markerEnd: { type: MarkerType.ArrowClosed }, style: { strokeWidth: 2, strokeDasharray: "5,5" } });
            }
          }
        }
      }

      // Avós Maternos (conectados à mãe se existir, ou aos tios maternos/contribuinte se não existir mãe)
      const avoMaterno = getRelatives("Avô Materno")[0];
      const avoaMaterna = getRelatives("Avó Materna")[0];
      
      if (avoMaterno || avoaMaterna) {
        const avoMaternoNode = avoMaterno && createNode(
          avoMaterno.nomeParente, 
          "Avô Materno", 
          (maeNode ? maeNode.position.x : centerX - nodeSpacingX) - nodeSpacingX/2, 
          (maeNode ? maeNode.position.y : centerY - nodeSpacingY) - nodeSpacingY
        );
        
        const avoaMaternaNode = avoaMaterna && createNode(
          avoaMaterna.nomeParente, 
          "Avó Materna", 
          (maeNode ? maeNode.position.x : centerX - nodeSpacingX) + nodeSpacingX/2, 
          (maeNode ? maeNode.position.y : centerY - nodeSpacingY) - nodeSpacingY
        );

        if (avoMaternoNode) {
          nodes.push(avoMaternoNode);
          if (maeNode) {
            edgeList.push({ id: `edge-avom`, source: avoMaternoNode.id, target: maeNode.id, markerEnd: { type: MarkerType.ArrowClosed }, style: { strokeWidth: 2 } });
          } else {
            // Conecta aos tios maternos ou ao contribuinte
            const hasTiosMaternos = tiosMaternos.length > 0;
            if (hasTiosMaternos) {
              tiosMaternos.forEach((tio, idx) => {
                const tioNodeId = nodeMap[tio.descricaoParentesco + tio.nomeParente];
                if (tioNodeId) {
                  edgeList.push({ id: `edge-avom-tio-${idx}`, source: avoMaternoNode.id, target: tioNodeId, markerEnd: { type: MarkerType.ArrowClosed }, style: { strokeWidth: 2 } });
                }
              });
            } else {
              edgeList.push({ id: `edge-avom-contrib`, source: avoMaternoNode.id, target: mainNode.id, markerEnd: { type: MarkerType.ArrowClosed }, style: { strokeWidth: 2, strokeDasharray: "5,5" } });
            }
          }
        }

        if (avoaMaternaNode) {
          nodes.push(avoaMaternaNode);
          if (maeNode) {
            edgeList.push({ id: `edge-avoam`, source: avoaMaternaNode.id, target: maeNode.id, markerEnd: { type: MarkerType.ArrowClosed }, style: { strokeWidth: 2 } });
          } else {
            // Conecta aos tios maternos ou ao contribuinte
            const hasTiosMaternos = tiosMaternos.length > 0;
            if (hasTiosMaternos) {
              tiosMaternos.forEach((tio, idx) => {
                const tioNodeId = nodeMap[tio.descricaoParentesco + tio.nomeParente];
                if (tioNodeId) {
                  edgeList.push({ id: `edge-avoam-tio-${idx}`, source: avoaMaternaNode.id, target: tioNodeId, markerEnd: { type: MarkerType.ArrowClosed }, style: { strokeWidth: 2 } });
                }
              });
            } else {
              edgeList.push({ id: `edge-avoam-contrib`, source: avoaMaternaNode.id, target: mainNode.id, markerEnd: { type: MarkerType.ArrowClosed }, style: { strokeWidth: 2, strokeDasharray: "5,5" } });
            }
          }
        }
      }

      // Filhos
      const filhos = data.filter(r => r.descricaoParentesco.includes("Filh"));
      filhos.forEach((filho, idx) => {
        const childNode = createNode(filho.nomeParente, filho.descricaoParentesco, centerX + (idx * nodeSpacingX) - ((filhos.length - 1) * nodeSpacingX / 2), centerY + nodeSpacingY);
        nodes.push(childNode);
        edgeList.push({ id: `edge-filho-${idx}`, source: mainNode.id, target: childNode.id, markerEnd: { type: MarkerType.ArrowClosed }, style: { strokeWidth: 2 } });
      });

      setNodes(nodes);
      setEdges(edgeList);
    });
  }, [cpf, exibir, nomeContribuinte]);

  return (
    <div style={{ height: 800, width: "100%" }}>
      <ReactFlow nodes={nodes} edges={edges} fitView>
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}